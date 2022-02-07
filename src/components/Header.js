import React, { useState } from 'react';
import { Grid, Text, Button, Image } from '../elements'
import { getCookie, deleteCookie } from '../shared/Cookie';
import { useSelector, useDispatch } from 'react-redux';
import { actionCreators as userActions } from '../redux/modules/user';
import { history } from '../redux/configStore'
import { apiKey } from '../shared/firebase';
import NotiBadge from './NotiBadge';

const Header = (props) => {

    const is_login = useSelector((state) => state.user.is_login);

    const dispatch = useDispatch();

    const _session_key = `firebase:authUser:${apiKey}:[DEFAULT]`;
    const is_session = sessionStorage.getItem(_session_key) ? true : false;



    if (is_login && is_session) {
        //쿠키가 잇으면 여기 보여줌(로그인상태)
        return (
            <React.Fragment>
                <Grid is_flex padding='4px 16px'>
                    <Grid>
                        <Text margin="0px" size='24px' bold>헬로월드!</Text>
                    </Grid>

                    <Grid is_flex>
                        <NotiBadge _onClick={() => { history.push('/notification') }}/>
                        <Button text='로그아웃' _onClick={() => { dispatch(userActions.logoutFB()) }}></Button>
                    </Grid>
                </Grid>
            </React.Fragment>

        )
    }

    return (
        <React.Fragment>
            <Grid is_flex padding='4px 16px'>
                <Grid>
                    <Text margin="0px" size='24px' bold>헬로월드!</Text>
                </Grid>

                <Grid is_flex>
                    <Button text='로그인' _onClick={() => { history.push('/login') }}></Button>
                    <Button text='회원가입' _onClick={() => { history.push('/signup') }}></Button>
                </Grid>
            </Grid>
        </React.Fragment>
    )
}

Header.defaultProps = {

}

export default Header;