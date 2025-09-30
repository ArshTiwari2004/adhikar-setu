// firebase/authService.js
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import {
    doc,
    setDoc,
    getDoc,
    updateDoc,
    serverTimestamp
} from 'firebase/firestore';
import { auth, db } from './firebase';

// User registration
export const registerUser = async (userData) => {
    try {
        // Create Firebase Auth user
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            userData.email,
            userData.password
        );
        const user = userCredential.user;

        // Create user profile in Firestore
        await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            email: userData.email,
            role: userData.role.toLowerCase(),
            language: userData.language,
            state: userData.state || null,
            district: userData.district || null,
            village: userData.village || null,
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp(),
            isApproved: ["public", "ngo", "researcher"].includes(userData.role),
            isActive: true,
            profile: {
                name: userData.name || userData.email.split('@')[0],
                phone: userData.phone || null,
                organization: userData.organization || null
            }
        });

     return {
  success: true,
  user: {
    uid: user.uid,
    email: userData.email,
    role: userData.role.toLowerCase(),
    isApproved: ["public", "ngo", "researcher"].includes(userData.role.toLowerCase())
  }
};

    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};

// User login
export const loginUser = async (email, password) => {
    try {
        console.log("Trying to login:", email, password);

        if (!email || !password) {
            throw new Error("Email and password are required");
        }

        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Fetch profile
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (!userDoc.exists()) {
            throw new Error("User profile not found");
        }

        const userData = userDoc.data();

        if (!userData.isApproved) {
            throw new Error("Account pending approval. Please contact administrator.");
        }

        await updateDoc(doc(db, "users", user.uid), {
            lastLogin: serverTimestamp(),
        });

        return { success: true, user: { uid: user.uid, ...userData } };
    } catch (error) {
        console.error("Login error:", error); // ✅ Debug log
        let errorMessage = "Login failed";
        if (error.code === "auth/user-not-found") {
            errorMessage = "No account found with this email.";
        } else if (error.code === "auth/wrong-password") {
            errorMessage = "Incorrect password.";
        } else if (error.code === "auth/invalid-email") {
            errorMessage = "Invalid email format.";
        }
        return { success: false, error: errorMessage };
    }
};


// User logout
export const logoutUser = async () => {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};

// Get current user profile
export const getCurrentUserProfile = async (uid) => {
    try {
        const userDoc = await getDoc(doc(db, 'users', uid));

        if (!userDoc.exists()) {
            throw new Error('User profile not found');
        }

        return {
            success: true,
            user: {
                uid: uid,
                ...userDoc.data()
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};

// Auth state listener
export const onAuthStateChange = (callback) => {
    return onAuthStateChanged(auth, callback);
};

// Role-based access control
export const checkPermissions = (userRole, requiredPermissions) => {
    const rolePermissions = {
        public: ['read_public_data'],
        gram_sabha: ['create_claim', 'view_own_claims', 'upload_evidence'],
        frc: ['view_village_claims', 'verify_claims', 'upload_gps_photos', 'recommend_claims'],
        revenue_officer: ['view_district_claims', 'upload_maps', 'verify_land_records'],
        sdlc: ['view_subdivision_claims', 'conduct_hearings', 'forward_to_dlc'],
        dlc: ['view_district_claims', 'final_approval', 'issue_titles', 'reject_claims'],
        slmc: ['view_state_data', 'generate_reports', 'monitor_progress'],
        mota: ['view_all_data', 'generate_analytics', 'system_admin'],
        ngo: ['view_aggregated_data', 'generate_research_reports'],
        researcher: ['view_aggregated_data', 'export_anonymized_data']
    };

    const userPermissions = rolePermissions[userRole] || [];
    return requiredPermissions.every(permission =>
        userPermissions.includes(permission)
    );
};