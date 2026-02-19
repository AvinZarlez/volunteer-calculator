// Cloud Sync Module
// Provides Firebase Authentication and Firestore sync so users can access
// their volunteer data from any browser or device.

// eslint-disable-next-line no-unused-vars
const CloudSyncModule = (function() {
    let auth = null;
    let db = null;
    let currentUser = null;
    let unsubscribeListener = null;
    let isSyncing = false;

    const DATA_COLLECTION = 'userData';
    const DATA_DOCUMENT = 'entries';

    // Returns true if a Firebase project has been configured
    function isConfigured() {
        return typeof firebaseConfig !== 'undefined' &&
            firebaseConfig.apiKey &&
            firebaseConfig.apiKey !== '';
    }

    // Initialize Firebase and set up auth state listener
    function init() {
        if (!isConfigured()) {
            return; // Running in local-only mode
        }

        try {
            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
            }
            auth = firebase.auth();
            db = firebase.firestore();
            auth.onAuthStateChanged(handleAuthStateChange);
            showCloudSyncUI();
        } catch (e) {
            console.error('Firebase initialization failed:', e);
        }
    }

    // Show the cloud sync button once Firebase is ready
    function showCloudSyncUI() {
        const loginBtn = document.getElementById('cloudSyncLoginBtn');
        if (loginBtn) {
            loginBtn.style.display = 'inline-block';
        }
    }

    // Handle auth state changes (login / logout)
    async function handleAuthStateChange(user) {
        currentUser = user;
        updateAuthUI(user);

        if (user) {
            await syncFromCloud();
            startRealtimeListener();
        } else {
            stopRealtimeListener();
        }
    }

    // Sign in with email and password
    async function signIn(email, password) {
        if (!auth) {
            throw new Error('Firebase not initialized');
        }
        try {
            await auth.signInWithEmailAndPassword(email, password);
        } catch (e) {
            throw new Error(getAuthErrorMessage(e.code));
        }
    }

    // Create a new account with email and password
    async function signUp(email, password) {
        if (!auth) {
            throw new Error('Firebase not initialized');
        }
        try {
            await auth.createUserWithEmailAndPassword(email, password);
        } catch (e) {
            throw new Error(getAuthErrorMessage(e.code));
        }
    }

    // Sign out the current user
    async function signOut() {
        if (!auth) {
            return;
        }
        stopRealtimeListener();
        await auth.signOut();
    }

    // Upload all local data to Firestore
    async function syncToCloud() {
        if (!db || !currentUser) {
            return;
        }

        try {
            isSyncing = true;
            updateSyncStatus('syncing');

            const localData = StorageModule.getAll();
            const docRef = db
                .collection('users')
                .doc(currentUser.uid)
                .collection(DATA_COLLECTION)
                .doc(DATA_DOCUMENT);

            await docRef.set({
                entries: localData,
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
                lastUpdatedBy: navigator.userAgent
            });

            updateSyncStatus('synced');
        } catch (e) {
            console.error('Failed to sync to cloud:', e);
            updateSyncStatus('error');
        } finally {
            isSyncing = false;
        }
    }

    // Download cloud data and merge it with local data
    async function syncFromCloud() {
        if (!db || !currentUser) {
            return;
        }

        try {
            updateSyncStatus('syncing');

            const docRef = db
                .collection('users')
                .doc(currentUser.uid)
                .collection(DATA_COLLECTION)
                .doc(DATA_DOCUMENT);

            const doc = await docRef.get();

            if (doc.exists) {
                const cloudData = doc.data().entries || {};
                const localData = StorageModule.getAll();
                const merged = mergeData(localData, cloudData);
                StorageModule.importAll(merged);
                refreshUI();
            } else {
                // No cloud data yet — upload what we have locally
                await syncToCloud();
                return;
            }

            updateSyncStatus('synced');
        } catch (e) {
            console.error('Failed to sync from cloud:', e);
            updateSyncStatus('error');
        }
    }

    // Listen for real-time changes pushed from other devices
    function startRealtimeListener() {
        if (!db || !currentUser) {
            return;
        }
        stopRealtimeListener();

        const docRef = db
            .collection('users')
            .doc(currentUser.uid)
            .collection(DATA_COLLECTION)
            .doc(DATA_DOCUMENT);

        unsubscribeListener = docRef.onSnapshot(
            (snapshot) => {
                // Ignore local writes or in-progress syncs to avoid loops
                if (snapshot.metadata.hasPendingWrites || isSyncing) {
                    return;
                }
                if (!snapshot.exists) {
                    return;
                }

                const cloudData = snapshot.data().entries || {};
                const localData = StorageModule.getAll();
                const merged = mergeData(localData, cloudData);
                StorageModule.importAll(merged);
                refreshUI();
                updateSyncStatus('synced');
            },
            (error) => {
                console.error('Real-time listener error:', error);
                updateSyncStatus('error');
            }
        );
    }

    // Stop the real-time listener
    function stopRealtimeListener() {
        if (unsubscribeListener) {
            unsubscribeListener();
            unsubscribeListener = null;
        }
    }

    // Merge two data objects by entry ID (union, no duplicates)
    function mergeData(localData, cloudData) {
        const merged = {};

        // Start with all local groups
        for (const groupName in localData) {
            merged[groupName] = [...localData[groupName]];
        }

        // Add cloud entries that don't exist locally
        for (const groupName in cloudData) {
            if (!merged[groupName]) {
                merged[groupName] = [];
            }
            const existingIds = new Set(merged[groupName].map((e) => e.id));
            const newEntries = cloudData[groupName].filter(
                (e) => !existingIds.has(e.id)
            );
            merged[groupName] = [...merged[groupName], ...newEntries];
        }

        return merged;
    }

    // Refresh the data viewer UI after a sync
    function refreshUI() {
        if (typeof refreshGroupList === 'function') {
            refreshGroupList();
        }
        if (typeof loadGroupData === 'function') {
            loadGroupData();
        }
    }

    // Update the header auth area to reflect current user state
    function updateAuthUI(user) {
        const loginBtn = document.getElementById('cloudSyncLoginBtn');
        const userStatus = document.getElementById('cloudSyncUserStatus');
        const userEmailEl = document.getElementById('cloudSyncUserEmail');
        const syncIndicator = document.getElementById('syncStatusIndicator');

        if (!loginBtn || !userStatus) {
            return;
        }

        if (user) {
            loginBtn.style.display = 'none';
            userStatus.style.display = 'flex';
            if (userEmailEl) {
                userEmailEl.textContent = user.email;
            }
            if (syncIndicator) {
                syncIndicator.style.display = 'inline';
            }
        } else {
            loginBtn.style.display = 'inline-block';
            userStatus.style.display = 'none';
            if (syncIndicator) {
                syncIndicator.style.display = 'none';
            }
            updateSyncStatus('idle');
        }
    }

    // Update the sync status badge text and style
    function updateSyncStatus(status) {
        const indicator = document.getElementById('syncStatusIndicator');
        if (!indicator) {
            return;
        }

        const statusMap = {
            idle: { text: '', cls: '' },
            syncing: { text: '⏳ Syncing…', cls: 'sync-status-syncing' },
            synced: { text: '☁️ Synced', cls: 'sync-status-synced' },
            error: { text: '⚠️ Sync error', cls: 'sync-status-error' }
        };

        const info = statusMap[status] || statusMap.idle;
        indicator.textContent = info.text;
        indicator.className = 'sync-status ' + info.cls;
    }

    // Human-readable messages for common Firebase auth error codes
    function getAuthErrorMessage(code) {
        const messages = {
            'auth/invalid-email': 'Invalid email address.',
            'auth/user-disabled': 'This account has been disabled.',
            'auth/user-not-found': 'No account found with this email.',
            'auth/wrong-password': 'Incorrect password.',
            'auth/email-already-in-use': 'An account with this email already exists.',
            'auth/weak-password': 'Password must be at least 6 characters.',
            'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
            'auth/network-request-failed': 'Network error. Please check your connection.',
            'auth/invalid-credential': 'Invalid email or password.'
        };
        return messages[code] || 'Authentication error. Please try again.';
    }

    // ---- Modal helpers (called from inline HTML onclick handlers) ----

    // eslint-disable-next-line no-unused-vars
    function openAuthModal() {
        const modal = document.getElementById('cloudSyncModal');
        if (modal) {
            modal.style.display = 'flex';
            const emailInput = document.getElementById('authEmail');
            if (emailInput) {
                emailInput.focus();
            }
        }
    }

    // eslint-disable-next-line no-unused-vars
    function closeAuthModal() {
        const modal = document.getElementById('cloudSyncModal');
        if (modal) {
            modal.style.display = 'none';
        }
        clearAuthError();
    }

    function clearAuthError() {
        const errorEl = document.getElementById('authError');
        if (errorEl) {
            errorEl.style.display = 'none';
            errorEl.textContent = '';
        }
    }

    function showAuthError(msg) {
        const errorEl = document.getElementById('authError');
        if (errorEl) {
            errorEl.textContent = msg;
            errorEl.style.display = 'block';
        }
    }

    function getAuthFormValues() {
        const email = (document.getElementById('authEmail') || {}).value || '';
        const password = (document.getElementById('authPassword') || {}).value || '';
        return { email: email.trim(), password };
    }

    // Called by the Sign In button in the modal
    // eslint-disable-next-line no-unused-vars
    async function handleSignIn() {
        clearAuthError();
        const { email, password } = getAuthFormValues();
        if (!email || !password) {
            showAuthError('Please enter your email and password.');
            return;
        }
        const signInBtn = document.getElementById('authSignInBtn');
        if (signInBtn) {
            signInBtn.disabled = true;
        }
        try {
            await signIn(email, password);
            closeAuthModal();
        } catch (e) {
            showAuthError(e.message);
        } finally {
            if (signInBtn) {
                signInBtn.disabled = false;
            }
        }
    }

    // Called by the Create Account button in the modal
    // eslint-disable-next-line no-unused-vars
    async function handleSignUp() {
        clearAuthError();
        const { email, password } = getAuthFormValues();
        if (!email || !password) {
            showAuthError('Please enter an email and password.');
            return;
        }
        const signUpBtn = document.getElementById('authSignUpBtn');
        if (signUpBtn) {
            signUpBtn.disabled = true;
        }
        try {
            await signUp(email, password);
            closeAuthModal();
        } catch (e) {
            showAuthError(e.message);
        } finally {
            if (signUpBtn) {
                signUpBtn.disabled = false;
            }
        }
    }

    // ---- Initialization on DOM ready ----
    if (typeof document !== 'undefined') {
        document.addEventListener('DOMContentLoaded', function() {
            init();
        });
    }

    // Public API
    return {
        init,
        signIn,
        signUp,
        signOut,
        syncToCloud,
        isConfigured,
        isLoggedIn: () => currentUser !== null,
        openAuthModal,
        closeAuthModal,
        handleSignIn,
        handleSignUp
    };
})();
