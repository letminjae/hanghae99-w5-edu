import React from 'react';
import Post from '../components/Post'
import CommentList from '../components/CommentList';
import CommentWrite from '../components/CommentWrite';
import { useState } from 'react';

import Permit from '../shared/Permit'
import { useSelector, useDispatch } from 'react-redux';
import { actionCreators as postActions } from '../redux/modules/post';

const PostDetail = (props) => {
    const id = props.match.params.id;
    const dispatch = useDispatch()

    const user_info = useSelector((state) => state.user.user);
    const post_list = useSelector((store) => store.post.list);
    const post_i = post_list.findIndex(a => a.id === id);
    const post = post_list[post_i]

    React.useEffect(() => {

        if(post){
            return;
        }

        dispatch(postActions.getOnePostFB(id))
        
    }, [])

    return (
        <React.Fragment>
            {post && <Post {...post} is_me={post.user_info.user-id == user_info?.uid}/>}
            <Permit>
                <CommentWrite post_id={id}></CommentWrite>
            </Permit>
            <CommentList post_id={id}></CommentList>
        </React.Fragment>
    )

}

export default PostDetail