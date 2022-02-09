//PostList.js

import React from 'react';
import Post from '../components/Post'
import LeftPost from '../components/LeftPost'
import RightPost from '../components/RightPost'
import { useSelector, useDispatch } from 'react-redux';
import { actionCreators as postActions } from '../redux/modules/post';
import InfinityScroll from '../shared/InfinityScroll';
import { Grid } from '../elements';

const PostList = (props) => {
    const dispatch = useDispatch();
    const post_list = useSelector((state) => state.post.list);
    const user_info = useSelector((state) => state.user.user);
    const is_loading = useSelector((state) => state.post.is_loading);
    const paging = useSelector((state) => state.post.paging);

    const { history } = props;

    React.useEffect(() => {

        if (post_list.length < 2) {
            dispatch(postActions.getPostFB());
        }
    }, [])

    return (
        <React.Fragment>
            <Grid padding="20px 0px 20px 0px">
                <InfinityScroll
                    callNext={() => {
                        dispatch(postActions.getPostFB(paging.next))
                    }}
                    is_next={paging.next ? true : false}
                    loading={is_loading}
                >
                    {post_list.map((p, i) => {
                        if (user_info && p.user_info.user_id === user_info.uid) {
                            if (p.direction === "center") {
                                return <Post key={p.id} {...p} is_me />
                            } else if (p.direction === "right") {
                                return <RightPost key={p.id} {...p} is_me />
                            } else if (p.direction === "left") {
                                return <LeftPost key={p.id} {...p} is_me />
                            }

                        } else {
                            if (p.direction === "center") {
                                return <Post key={p.id} {...p} />
                            } else if (p.direction === "right") {
                                return <RightPost key={p.id} {...p} />
                            } else if (p.direction === "left") {
                                return <LeftPost key={p.id} {...p} />
                            }

                        }
                    })}
                </InfinityScroll>
            </Grid>
        </React.Fragment >
    )
}

export default PostList;