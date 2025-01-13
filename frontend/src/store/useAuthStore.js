import {create} from 'zustand';
import {axiosInstance} from '../lib/axios.js';
import toast from 'react-hot-toast';
// Zustand store for authentication
// authUser: The authenticated user
// isChecking: A boolean to check if the user is being authenticated
// This store is used to store the authenticated user and check if the user is being authenticated

export const useAuthStore = create((set)=>({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,

    isCheckingAuth: true,
    checkAuth: async()=>{
        try{
            const res = await axiosInstance.get('/auth/check');
            console.log("authUser",res.data);
            set({authUser:res.data})
        }catch(e){
            console.log("error checking auth",e);
            set({authUser:null})
        }finally{
            set({isCheckingAuth:false});
        }
    },
    
    signup: async(data)=>{
        set({isSigningUp:true});
        try{
            const res = await axiosInstance.post('/auth/signup',data);
            set({authUser:res.data});

            toast.success("Signed up successfully");
        }catch(e){
            toast.error("Error signing up");
            console.log("error signing up",e);

        }
    },
    logout: async()=>{
        try{
            await axiosInstance.post('/auth/logout');
            set({authUser:null});
            toast.success("Logged out successfully");
        }catch(e){
            console.log("error logging out",e);
            toast.error("Error logging out");
        }
    },
    login:async(data)=>{
        set({isLoggingIn:true});
        try{
            const res = await axiosInstance.post('/auth/login',data);
            set({authUser:res.data});
            toast.success("Logged in successfully");
        }catch(e){
            console.log("error logging in",e);
            toast.error("Error logging in");
        }
    },
    updateProfile: async(data)=>{
        set({isUpdatingProfile:true});
        try{
            const res = await axiosInstance.put('/auth/updateProfile',data);
            set({authUser:res.data});
            toast.success("Profile updated successfully");
        }catch(error){
            console.log("error updating profile",error);
            toast.error("Error updating profile");
        }finally{
            set({isUpdatingProfile:false});
        }
    } ,
    }));