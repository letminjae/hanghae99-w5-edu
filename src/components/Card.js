import React from 'react'
import { Grid, Text, Image } from '../elements'

const Card = (props) => {
    const { image_url, user_name, post_id } = props

    return (
        <Grid is_flex padding='16px' bg='#ffffff' margin='8px 0px'>
            <Grid width='auto' margin='0px 8px 0px 0px'>
                <Image shape='square' size={60} image_url={image_url} />
            </Grid>
            <Grid>
                <Text>
                    <b>{user_name}</b>님이 게시물에 댓글을 남겼습니다!
                </Text>
            </Grid>
        </Grid>
    )

}

Card.defaultProps = {
    image_url: '',
    user_name: '',
    post_id: null,
}

export default Card
