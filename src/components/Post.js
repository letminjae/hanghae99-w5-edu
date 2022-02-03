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
                    <Image shape='rectangle' src={props.src} />
                </Grid>
                <Grid padding='16px'>
                    <Text bold>댓글 {props.comment_cnt}개</Text>
                </Grid>
                <div>user profile / user name / insert datetime </div>
                <div>contents</div>
                <div>image</div>
                <div>comment cnt</div>
            </Grid>
        </React.Fragment>
    )
}

Post.defaultProps = {
    user_info : {
      user_name : '민재',
      user_profile : 'https://i.pinimg.com/236x/87/b1/3e/87b13e11d3fa05c3cf5b43d04c61e750.jpg',
    },
    image_url: 'https://i.pinimg.com/236x/87/b1/3e/87b13e11d3fa05c3cf5b43d04c61e750.jpg',
    contents : '고양이네요!!!',
    comment_cnt : 10,
    insert_dt : '2022-02-04 10:00:00',
  }

export default Post;