import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Spin } from 'antd';
import { useSendPasswordResetEmail, useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase.init';
import { Modal } from 'antd';


const SignIn = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [email, setEmail] = useState('')
    const navigate = useNavigate()

    const [
        signInWithEmailAndPassword,
        user,
        loading,
        error,
    ] = useSignInWithEmailAndPassword(auth);

    const [sendPasswordResetEmail, sending, resetPasswordError] = useSendPasswordResetEmail(auth);


    const onSubmit = data => {
        signInWithEmailAndPassword(data.email, data.password)
    }


    if (error) {
        toast.error("Wrong Credentials")
    }
    if (resetPasswordError) {
        toast.error("User Not found")
    }
    if (user) {
        navigate('/index')
    }

    const success = () => {
        Modal.success({
            content: `A reset email has sent to your ${email}`,
        });
    };
    const errorMessage = () => {
        Modal.error({
            content: `Provide your email to the email input field`,
        });
    };

    const resetPassword = async () => {
        if (email !== "") {
            await sendPasswordResetEmail(email);
            success()
        } else {
            errorMessage()
        }
    }


    return (
        <div className='h-[100vh] flex flex-col justify-center items-center'>

            <div className="textTitle">
                <h1 className='text-3xl font-bold my-10'>Sign In </h1>
            </div>

            <div className="formContainer">

                <form onSubmit={handleSubmit(onSubmit)}>

                    <input onChange={(e) => setEmail(e.target.value)} placeholder='Your Email'  {...register("email", {
                        required: true,
                        onChange: (e) => setEmail(e.target.value)
                    })} />
                    {errors.email && <span className='text-red-600'>This field is required</span>}
                    <input type={'password'} placeholder='Your Password' {...register("password", { required: true })} />

                    {errors.password && <span className='text-red-600'>This field is required</span>}

                    {
                        loading || sending ?
                            <button disabled className='text-center'><Spin className='block mx-auto text-center' /></button>
                            :
                            <input className='cursor-pointer hover:border-1 hover:border-blue-500 hover:text-blue-500' type="submit" />
                    }
                </form>
                <p>  Forgot Password? <button onClick={() => resetPassword()} className='text-blue-400'>Reset Password Here</button></p>

                No account? <Link to={'/signup'}>Sign Up Here</Link>
            </div>
        </div>
    );
};

export default SignIn;