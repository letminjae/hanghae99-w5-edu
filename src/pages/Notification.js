import React from 'react'
import {Grid, Text, Image} from '../elements'
import Card from '../components/Card'

const Notification = () => {
    let noti = [
        {user_name: '민재', post_id: 'post1', image_url: '',},
        {user_name: '짱', post_id: 'post2', image_url: '',},
        {user_name: '코딩', post_id: 'post3', image_url: '',},
        {user_name: '할수잇다', post_id: 'post4', image_url: '',},
        {user_name: '나는야', post_id: 'post5', image_url: '',},
        {user_name: 'FE개발자', post_id: 'post6', image_url: '',},
    ]
    return(
        <React.Fragment>
            <Grid padding='16px' bg='#EFF6FF'>
                {noti.map((a,i) => {
                    return(
                        <Card key={a.post_id} {...a}/>
                    )
                })
            }
            </Grid>
        </React.Fragment>
    );
}

export default Notification;
