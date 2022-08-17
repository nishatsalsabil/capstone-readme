import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    HomeOutlined,
    PlusOutlined,
    DownOutlined,
    MoreOutlined,
} from '@ant-design/icons'; //importing icons from ant design 

import { AiOutlineHeart, AiOutlineMessage, AiFillHeart } from 'react-icons/ai'
import { TbEdit } from 'react-icons/tb'
import { Dropdown, Space, Avatar, Layout, Menu, Divider, Input, Modal, Skeleton } from 'antd';
import { signOut, updateProfile } from 'firebase/auth';
import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom'
import { auth, db } from '../../firebase.init';
import Loading from '../Loading/Loading';
import { toast } from 'react-toastify';
import { collection, addDoc, serverTimestamp, doc, updateDoc, onSnapshot, deleteDoc, getDoc, setDoc } from "firebase/firestore";
import { useEffect } from 'react';


const { Header, Sider, Content } = Layout;
const { TextArea } = Input;

const Outline = () => {
    const [user, loading, error] = useAuthState(auth);
    let userID;
    let userEmail;
    const key = process.env.REACT_APP_IMG_BB_KEY
    const [collapsed, setCollapsed] = useState(false); // hooks for the side menu
    const navigate = useNavigate()
    const [posts, setPosts] = useState([])
    const [postLoading, setPostLoading] = useState(false)
    const [commentLoading, setCommentLoading] = useState(false)
    const [reactionLoading, setReactionLoading] = useState(false)
    const [islike, setLike] = useState([])
    const [comments, setComments] = useState([])


    const handleEditFormSubmit = async (e) => {
        e.preventDefault()
        const docRef = doc(db, 'posts', e.target.id.value);

        await updateDoc(docRef, {
            post: e.target.editPost.value
        });
        Modal.destroyAll()
        toast.success("Post Updated")

    }


    function DataModal(id, post) {
        Modal.info({
            title: 'Edit Post',
            content: (
                <div className="modal_data_wrapper">
                    <form onSubmit={(e) => handleEditFormSubmit(e)}>
                        <input type="text" hidden name="id" value={id} />
                        <textarea className='border-2' name="editPost" cols="40" rows="5" defaultValue={post}></textarea>
                        <input type="submit" className='mt-5 mr-auto w-20 block hover:cursor-pointer ease-in transition-all 300   hover:border-1 hover:border-blue-500 hover:bg-blue-500 ' value={'Edit'} />
                    </form>
                </div>
            ),
            okText: "Cancel"
        })
    }


    const handlePostEditModal = (id, post) => {
        DataModal(id, post)
    }

    const handlePostDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete the post?')) {
            await deleteDoc(doc(db, "posts", id));
            toast.success("Post Deleted")
        }
    }


    const postEdit = (postID, post = "") => (
        <Menu
            items={[
                {
                    key: `edit-${postID}`,
                    label: (
                        <button onClick={() => handlePostEditModal(postID, post)}>Edit</button>
                    ),
                },
                {
                    key: `delete-${postID}`,
                    label: (
                        <button onClick={() => handlePostDelete(postID)}>Delete</button>
                    ),
                },
            ]}
        />
    )


    useEffect(() => {
        setPostLoading(true)
        return onSnapshot(collection(db, "posts"), (snapshot) => {
            setPosts(snapshot.docs.map((doc) => [{ ...doc.data(), "id": doc.id }]))
            setPostLoading(false)
        })
    }, [])


    useEffect(() => {
        setCommentLoading(true)
        return onSnapshot(collection(db, "comments"), (snapshot) => {
            setComments(snapshot.docs.map((doc) => [{ ...doc.data(), "id": doc.id }]))
            setCommentLoading(false)
        })
    }, [])


    if (error) {
        toast.error("Something Went Wrong")
    }
    if (loading || postLoading || reactionLoading) {
        return <Loading />
    }
    if (user) {
        userID = user.uid
        userEmail = user.email
    }

    const handleEditProfile = (e) => {
        e.preventDefault()


        if (e.target.photos.files.length !== 0) {
            const image = e.target.photos.files
            const formData = new FormData();
            formData.append('image', image[0]);
            const url = `https://api.imgbb.com/1/upload?key=${key}`;


            fetch(url, {
                method: 'POST',
                body: formData
            })
                .then(res => res.json())
                .then(result => {
                    if (result.success) {
                        updateProfile(auth.currentUser, {
                            displayName: e.target.userName.value, photoURL: result.data.thumb.url
                        }).then(() => {
                            toast.success("Profile Updated")
                            Modal.destroyAll() // the modal/pop up will vanish 
                        }).catch((error) => {
                            toast.error("Something Went Wrong")
                            Modal.destroyAll()
                        });
                    } else {
                        toast.error("Something Went Wrong")
                    }
                })
        } else {
            updateProfile(auth.currentUser, {
                displayName: e.target.userName.value
            }).then(() => {
                toast.success("Profile Updated")
                Modal.destroyAll()
            }).catch((error) => {
                toast.error("Something Went Wrong")
                Modal.destroyAll()
            });
        }
    }


    function editProfileModal() {
        Modal.info({
            title: 'Edit Profile',
            content: (
                <div className="container grid grid-cols-1 justify-center items-center">
                    <form onSubmit={(e) => handleEditProfile(e)}>
                        <div className="left">
                            <input className='border-none' name='photos' type="file" />
                        </div>
                        <div className="right">

                            <input type="text" defaultValue={user.displayName} name="userName" placeholder='Username' />
                            <input type="email" disabled defaultValue={user.email} name="email" placeholder='Email' />
                            <input className='mt-5 mr-auto w-20 block hover:cursor-pointer ease-in transition-all 300 hover:text-white   hover:border-1 hover:border-blue-500 hover:bg-blue-500 ' type="submit" value={'Edit now'} />

                        </div>
                    </form>
                </div>
            ),
            okText: "Close",
        })
    }


    function profileModal() {
        Modal.info({
            title: 'Profile',
            content: (
                <div className="profileContaienr ">
                    <>
                        <div className="container grid grid-cols-2">
                            <div className="left blok my-auto">
                                {
                                    user.photoURL ?
                                        <>
                                            <img className='w-16 rounded-full'
                                                src={user?.photoURL} alt="userImag" />
                                        </>
                                        :
                                        <>
                                            <Avatar size={'large'} icon={<UserOutlined />} />
                                        </>
                                }
                            </div>
                            <div className="right">
                                <p> Name: {user.displayName}</p>
                                <p>Email:{user.email}</p>
                                <button onClick={() => {
                                    Modal.destroyAll()
                                    return editProfileModal()
                                }} className='text-blue-400'>Edit <TbEdit className='inline-block' /></button>
                            </div>
                        </div>
                    </>
                </div>
            ),
            okText: "Close",
        })
    }


    const profileMenu = (
        <Menu
            items={[
                {
                    key: '1',
                    label: (
                        <button onClick={() => profileModal()} >Profile</button>
                    ),
                },
                {
                    key: '2',
                    label: (
                        <button onClick={() => {
                            signOut(auth)
                            navigate('/')
                        }} >Logout</button>
                    ),
                },
            ]}
        />
    );


    const handlePost = async (e) => {
        e.preventDefault() // preventing the page from reloading 
        await addDoc(collection(db, "posts"), {
            userEmail: userEmail,
            userName: user.displayName,
            userId: userID,
            userImg: user.photoURL,
            post: e.target.post.value,
            likes: 0,
            timestamp: serverTimestamp()
        });
        toast.success("Successfully Posted")
    }


    const handleLikeButton = async (e, post_id) => {
        e.preventDefault()
        setReactionLoading(true)
        const docRef = doc(db, "posts", post_id); // getting the reference of the collection from firebase 
        const postLikeRef = doc(db, "likes", post_id); // getting the reference of the collection from firebase 


        const docSnap = await getDoc(docRef); // getting the full document
        const postLikeDocSnap = await getDoc(postLikeRef); // getting the full document

        if (!postLikeDocSnap.data()) {
            await updateDoc(docRef, {
                likes: docSnap.data().likes + 1 
            });
            await setDoc(doc(db, "likes", post_id), {
                user: [userID]
            })

            setLike([...islike, post_id]) // storing the post id that a user has already liked

        } else {
            if (postLikeDocSnap.data().user.indexOf(userID) === -1) { // id does not exist in the array
                await updateDoc(docRef, {
                    likes: docSnap.data().likes + 1 // increasing like count 
                });
                await updateDoc(postLikeRef, {
                    user: [...postLikeDocSnap.data().user, userID] // storing how many post a user has liked 
                });
                setLike([...islike, post_id])
            } else {

                const updatedArray = postLikeDocSnap.data().user.filter((id) => id !== userID)

                await updateDoc(docRef, {
                    likes: docSnap.data().likes - 1
                });
                await updateDoc(postLikeRef, {
                    user: updatedArray
                });
                const likeArrayUpdate = islike.filter((id) => id !== post_id)
                setLike(likeArrayUpdate)
            }
        }
        setReactionLoading(false)

    }

    const handleSubmitComment = async (e, post_id) => {
        e.preventDefault()

        await addDoc(collection(db, "comments"), {
            userID: userID,
            userImg: user.photoURL,
            userName: user.displayName,
            postId: post_id,
            comment: e.target.comment.value,
            timestamp: serverTimestamp()
        });
    }

    const checkIfPostisLiked = async (post_id) => {
        const postLikeRef = doc(db, "likes", post_id); // getting the reference of the collection from firebase 
        const postLikeDocSnap = await getDoc(postLikeRef); // getting the full document

        if (postLikeDocSnap.data()) {
            if (postLikeDocSnap.data().user?.indexOf(userID) !== -1) {
                setLike([...islike, post_id])
            }
        }
    }


    return (
        <Layout>
            <Sider trigger={null} collapsible collapsed={collapsed} className='min-h-[100vh]' >
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    items={[
                        {
                            key: '1',
                            icon: <HomeOutlined />,
                            label: 'Home',
                        },
                        {
                            key: '2',
                            icon: <PlusOutlined />,
                            label: 'Post',
                        },
                        {
                            key: '3',
                            icon: <UserOutlined />,
                            label: <button onClick={() => { profileModal() }} >Profile</button>,
                        },
                    ]}
                />
            </Sider>
            <Layout className="site-layout mx-auto ">

                <Header
                    className="site-layout-background"
                    style={{
                        paddingLeft: '10px',
                    }}
                >

                    <div className="headerContaier flex flex-row justify-between items-center">
                        <div className="left">
                            {/* icon to collapse the navigation menu */}
                            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                                className: 'trigger',
                                onClick: () => setCollapsed(!collapsed),
                            })}
                        </div>
                        <div className="middle">
                            <p className='font-extrabold text-2xl p-0 m-0 mobile:hidden laptop:inline-block desktop:inline-block tablet:inline-block'>Readme-c17</p>
                        </div>
                        <div className="right">
                            <Dropdown overlay={profileMenu}>
                                {/* e.preventDefault() used to stop the page from reloading */}
                                {/* Whenever user clicks an event object shoots, inside that event object contains preventDefault */}
                                <button onClick={
                                    (event) => event.preventDefault()
                                }>
                                    <Space>
                                        {
                                            user.photoURL ?
                                                <>
                                                    <img className='w-10 rounded-full'
                                                        src={user?.photoURL} alt="userImag" /> <span>{user.displayName}</span>
                                                </>
                                                :
                                                <>
                                                    <Avatar icon={<UserOutlined />} />{user.displayName}
                                                </>
                                        }
                                        <DownOutlined />
                                    </Space>
                                </button>
                            </Dropdown>
                        </div>
                    </div>
                </Header>


                <Content
                    className="content w-full container mt-10 mx-auto h-auto laptop:px-0 mobile:px-5 desktop:px-0 "
                >
                    <div className="grid grid-cols-1">
                        <div className="writePost card mb-10 mobile:p-3 laptop:p-5 desktop:p-10">
                            <form onSubmit={(e) => handlePost(e)}  >
                                <div className=" flex flex-row justify-between">
                                    {
                                        user.photoURL ?
                                            <>
                                                <img className='w-16 rounded-full'
                                                    src={user?.photoURL} alt="userImag" />
                                            </>
                                            :
                                            <>
                                                <Avatar size={'large'} icon={<UserOutlined />} />
                                            </>
                                    }


                                    <div className="mx-2"></div>
                                    <TextArea rows={4} name="post" placeholder="Write what's on your mind" className="ml-10" />
                                </div>
                                <div className="submit flex justify-end">
                                    <input className='mt-5 mr-auto w-20 block hover:cursor-pointer ease-in transition-all 300   hover:border-1 hover:border-blue-500 hover:bg-blue-500 ' type="submit" value={'Post'} />
                                </div>
                            </form>
                        </div>

                        <div className="cardContainer">
                            {
                                posts.map((post, index) => {
                                    checkIfPostisLiked(post[0].id)

                                    return (
                                        <div className="card mb-10 mobile:p-3 laptop:p-5 desktop:p-10">
                                            <div className="grid grid-cols-1">
                                                <div className="postInfo flex justify-between items-center">
                                                    <div className="name flex flex-row">
                                                        <div className="top">
                                                            {
                                                                post[0].userImg ?
                                                                    <>
                                                                        <img className='w-16 rounded-full'
                                                                            src={post[0].userImg} alt="userImag" />
                                                                    </>
                                                                    :
                                                                    <>
                                                                        <Avatar size={'large'} icon={<UserOutlined />} />
                                                                    </>
                                                            }
                                                        </div>
                                                        <div className="bottom">
                                                            <span className='pl-2'>{post[0]?.userName}</span>
                                                            <span className='block text-xs text-gray-500 pl-2'>
                                                                {
                                                                    post[0]?.timestamp?.toDate().toDateString()
                                                                }
                                                            </span>
                                                        </div>

                                                    </div>
                                                    <div className="postMenu">

                                                        {
                                                            post[0]?.userId === user.uid && <>
                                                                <Dropdown overlay={postEdit(post[0].id, post[0]?.post)}>

                                                                    <MoreOutlined className='text-xl cursor-pointer' />

                                                                </Dropdown>
                                                            </>
                                                        }
                                                    </div>
                                                </div>
                                                <Divider />
                                                <div className="postContent text-lg font-bold">
                                                    {post[0]?.post}

                                                </div>
                                                <Divider />
                                                <div className="postInteracts">
                                                    <div className="interacts flex items-center">

                                                        {islike.indexOf(post[0].id) === -1 ?

                                                            <>
                                                                <AiOutlineHeart onClick={
                                                                    (e) => handleLikeButton(e, post[0].id)
                                                                } className='text-xl cursor-pointer m-3' /> {post[0]?.likes}
                                                            </>
                                                            :
                                                            <>
                                                                <AiFillHeart onClick={
                                                                    (e) => handleLikeButton(e, post[0].id)
                                                                } className='text-xl cursor-pointer m-3' /> {post[0]?.likes}
                                                            </>

                                                        }

                                                        <AiOutlineMessage className='text-xl cursor-pointer m-3' />
                                                    </div>
                                                </div>
                                                <div className="commentContainer m-5 w-full">
                                                    <div className="nameSection flex items-center">
                                                        <div className="top">
                                                            {
                                                                user.photoURL ?
                                                                    <>
                                                                        <img className='w-16 rounded-full'
                                                                            src={user?.photoURL} alt="userImag" />
                                                                    </>
                                                                    :
                                                                    <>
                                                                        <Avatar size={'large'} icon={<UserOutlined />} />
                                                                    </>
                                                            }
                                                        </div>
                                                        <div className="bottom">
                                                            <span className='pl-2'>
                                                                {
                                                                    user.displayName
                                                                }
                                                            </span>
                                                        </div>
                                                        <div className="formContainer mx-5 w-full">
                                                            <form className='flex' onSubmit={(e) => handleSubmitComment(e, post[0].id)} >
                                                                <input type="text" name="comment" placeholder='Write comment' className="inline-block w-full" />
                                                                <input className="w-20 placeholder:mt-5 mr-auto w-20 block hover:cursor-pointer ease-in transition-all 300   hover:border-1 hover:border-blue-500 hover:bg-blue-500 " type="submit" value={'Post'} />
                                                            </form>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="commentShowContainer">
                                                    {
                                                        commentLoading ?
                                                            <>
                                                                <Skeleton
                                                                    key={index}
                                                                    avatar
                                                                    active={true}
                                                                    paragraph={{
                                                                        rows: 4,
                                                                    }}
                                                                />
                                                            </>
                                                            :
                                                            comments.map((comment) =>
                                                                comment[0].postId === post[0].id &&
                                                                <>
                                                                    <div className="nameSection  pl-32 my-10">
                                                                        <div className="top flex items-center">
                                                                            <div className="top">
                                                                                {
                                                                                    comment[0].userImg ?
                                                                                        <>
                                                                                            <img className='w-10 rounded-full'
                                                                                                src={comment[0].userImg} alt="userImag" />
                                                                                        </>
                                                                                        :
                                                                                        <>
                                                                                            <Avatar size={'large'} icon={<UserOutlined />} />
                                                                                        </>
                                                                                }
                                                                            </div>
                                                                            <div className="bottom">
                                                                                <span className='pl-2'>
                                                                                    {
                                                                                        comment[0]?.userName
                                                                                    }
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="formContainer pl-5 mx-5 w-full">
                                                                            <p className='text-lg font-bold'>
                                                                                {
                                                                                    comment[0]?.comment
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            )
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </Content>
            </Layout>
        </Layout >
    );
};

export default Outline;