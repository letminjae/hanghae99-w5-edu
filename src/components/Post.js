import React from 'react';
import {Grid, Image, Text, Button}from '../elements'
import { history } from '../redux/configStore';
import { useDispatch } from 'react-redux';
import { actionCreators as postActions } from '../redux/modules/post';
import Like from '../shared/Like';

const Post = (props) => {
    const dispatch = useDispatch()
    
    const delPost = (post_id) => {
        dispatch(postActions.deletePostFB(post_id))
    }

    return (
        <React.Fragment>
            <Grid>
                <Grid is_flex padding='16px'>
                    <Grid is_flex width='auto'>
                        <Image shape='circle' src={props.src} />
                        <Text bold>{props.user_info.user_name}</Text>
                    </Grid>
                    <Grid is_flex width='auto'>
                        <Text>{props.insert_dt}</Text>
                        {props.is_me && <Button width='auto' margin='0px 0px 0px 8px' padding='4px' _onClick={() => { history.push(`/write/${props.id}`) }}>수정</Button>}
                        {props.is_me && <Button width='auto' margin='0px 0px 0px 4px' padding='4px' _onClick={() => {delPost(props.id)}}>삭제</Button>}
                    </Grid>
                </Grid>
                <Grid _onClick={() => history.push(`/post/${props.id}`)}>
                    <Grid padding='16px' size="18px">
                        <Text size="18px">{props.contents}</Text>
                    </Grid>
                    <Grid>
                        <Image shape='rectangle' src={props.image_url} />
                    </Grid>
                </Grid>    
                <Grid is_flex padding='16px'>
                    <Text margin='0px' bold>좋아요 {props.likes}개</Text>
                    <Grid width="80%">
                        <Text margin='0px' bold>댓글 {props.comment_cnt}개</Text>
                    </Grid>
                    <Like {...props} />
                </Grid>
            </Grid>
        </React.Fragment>
    )
}

Post.defaultProps = {
    user_info : {
      user_name : '민재',
      user_profile : 'http://img.insight.co.kr/static/2018/09/12/700/z7n04ul8ig3y27w6l6ok.jpg',
    },
    image_url: 'http://img.insight.co.kr/static/2018/09/12/700/z7n04ul8ig3y27w6l6ok.jpg',
    contents : '강아지네요!!!',
    comment_cnt : 10,
    insert_dt : '2022-02-04 10:00:00',
    is_me: false,
    bg: false,
  }

export default Post;