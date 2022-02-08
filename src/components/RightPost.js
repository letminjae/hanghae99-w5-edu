import React from 'react';
import { Grid, Image, Text, Button } from '../elements'
import { history } from '../redux/configStore';
import styled from 'styled-components';

const RightPost = (props) => {

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
                        {props.is_me && <Button width='auto' margin='4px' padding='4px' _onClick={() => { history.push(`/write/${props.id}`) }}>수정</Button>}
                    </Grid>
                </Grid>
                <Grid _onClick={() => history.push(`/post/${props.id}`)}>
                    <Box>
                        <Grid margin="2em 1em;">
                            <Image shape="rectangle" src={props.image_url} />
                        </Grid>
                        <Text margin="2em 1em;">{props.contents}</Text>
                    </Box>
                </Grid>
                <Grid padding='16px'>
                    <Text margin='0px' bold>댓글 {props.comment_cnt}개</Text>
                </Grid>
            </Grid>
        </React.Fragment>
    )
}

RightPost.defaultProps = {
    user_info: {
        user_name: '민재',
        user_profile: 'http://img.insight.co.kr/static/2018/09/12/700/z7n04ul8ig3y27w6l6ok.jpg',
    },
    image_url: 'http://img.insight.co.kr/static/2018/09/12/700/z7n04ul8ig3y27w6l6ok.jpg',
    contents: '강아지네요!!!',
    comment_cnt: 10,
    insert_dt: '2022-02-04 10:00:00',
    is_me: false,
}

const Box = styled.div`
    display: flex;
    justify-content: space-between;
    padding:"1em";
`;

export default RightPost;