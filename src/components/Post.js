import React from 'react';

import {Grid, Image, Text}from '../elements'

const Post = (props) => {

    return (
        <React.Fragment>
            <Grid>
                <Grid is_flex>
                    <Image shape='circle' src={props.src} />
                    <Text bold>{props.user_info.user_name}</Text>
                    <Text>{props.insert_dt}</Text>
                </Grid>
                <Grid padding='16px'>
                    <Text>{props.contents}</Text>
                </Grid>
                <Grid>
                    <Image shape='rectangle' src={props.image_url} />
                </Grid>
                <Grid padding='16px'>
                    <Text margin='0px' bold>댓글 {props.comment_cnt}개</Text>
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
  }

export default Post;