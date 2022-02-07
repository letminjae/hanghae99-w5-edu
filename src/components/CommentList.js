import React from 'react';
import { Grid, Image, Text, Button } from '../elements'

import { useDispatch, useSelector } from 'react-redux';
import { actionCreators as commentAcions} from '../redux/modules/comment';

const CommentList = (props) => {

    const {post_id} = props;

    const dispatch = useDispatch();

    const comment_list = useSelector(state => state.comment.list)
    
    React.useEffect( () => {
        if(!comment_list[post_id]){
            dispatch(commentAcions.getCommentFB(post_id));
        }
    }, [])

    if(!comment_list[post_id] || !post_id){
        return null;
    }

    return (
        <React.Fragment>
            <Grid padding='16px'>
                {comment_list[post_id].map((a,i) => {
                    return <CommentItem key={a.id} {...a}/>
                })}
            </Grid>
        </React.Fragment>
    );
};

CommentList.defaultProps ={
    post_id: null,
}

export default CommentList


const CommentItem = (props) => {

    const { user_id, user_name, user_profile, post_id, insert_dt, contents } = props;
    return (
        <Grid is_flex>
            <Grid is_flex width='auto'>
                <Image shape='circle' />
                <Text bold>{user_name}</Text>
            </Grid>
            <Grid is_flex margin='0px 4px'>
                <Text margin='0px'>{contents}</Text>
                <Text margin='0px'>{insert_dt}</Text>
            </Grid>
        </Grid>
    )
}

CommentItem.defaultProps = {
    user_profile: '',
    user_name: 'minjae',
    user_id: '',
    post_id: 1,
    insert_dt: '2022-01-01 10:00:00',
    contents: '귀여운 강아지네요!',
}