//PostList.js

import React from 'react';
import Post from '../components/Post'
import { useSelector, useDispatch } from 'react-redux';
import { actionCreators as postActions } from '../redux/modules/post';

const PostList = (props) => {
    const dispatch = useDispatch();
    const post_list = useSelector((state) => state.post.list);

    console.log(post_list)

    React.useEffect(() => {

        if(post_list.length === 0){
            dispatch(postActions.getPostFB());
        }
        
    }, [])

    return (
        <React.Fragment>
            {post_list.map((a,i) => {
                return <Post key={a.i} {...a} />
            })}
        </React.Fragment>
    )
}

export default PostList;