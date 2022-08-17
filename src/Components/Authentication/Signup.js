import React from 'react';
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { updateProfile } from "firebase/auth";
import { Spin } from 'antd';
import { auth } from '../../firebase.init'


const Signup = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const [
        createUserWithEmailAndPassword,
        user,
        loading,
        error,
    ] = useCreateUserWithEmailAndPassword(auth);

    const onSubmit = async data => {
        // console.log(data)
        await createUserWithEmailAndPassword(data.email, data.password)
        updateProfile(auth.currentUser, {
            displayName: data.name
        })
    }

    if (error) {
        console.log(error);
    }
    if (user) {
        toast("Account Created Successfully. Please Sign in ");
    }


    return (
        <div className='h-[100vh] flex flex-col justify-center items-center'>

            <div className="textTitle">
                <h1 className='text-3xl font-bold my-10'>Sign Up </h1>
            </div>

            <div className="formContainer">

                <form onSubmit={handleSubmit(onSubmit)}>

                    <input placeholder='Your Name'  {...register("name", {
                        required: true
                    })} />
                    {errors.name && <span className='text-red-600'>This field is required</span>}

                    <input placeholder='Your Email'  {...register("email", {
                        required: true
                    })} />
                    {errors.email && <span className='text-red-600'>This field is required</span>}

                    <input type={'password'} placeholder='Your Password' {...register("password", { required: true })} />
                    {errors.password && <span className='text-red-600'>This field is required</span>}

                    {
                        loading ?
                            <button disabled className='text-center'><Spin className='block mx-auto text-center' /></button>
                            :
                            <input className='cursor-pointer hover:border-1 hover:border-blue-500 hover:text-blue-500' type="submit" />
                    }
                </form>

                Already have an account? <Link to={'/'}>Sign In here</Link>
            </div>
        </div>
    );
};

export default Signup;