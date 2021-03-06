import React, { useState } from "react";
import { Badge } from "@material-ui/core";
import NotificationsIcon from '@mui/icons-material/Notifications';
import { realtime } from "../shared/firebase";
import { useSelector } from "react-redux";

const NotiBadge = (props) => {
    const [is_read, setIsRead] = useState(true);
    const user_id = useSelector(state => state.user.user.uid);

    const notiCheck = () => {
        const notiDB = realtime.ref(`noti/${user_id}`);
        notiDB.update({read: true});
        props._onClick();
    }

    React.useEffect(() => {
        const notiDB = realtime.ref(`noti/${user_id}`);

        notiDB.on("value", (snapshot) => {
            setIsRead(snapshot.val().read)
        });
        return () => notiDB.off();
    }, []);

    return(
        <React.Fragment>
            <Badge color="secondary" variant="dot" invisible={is_read} onClick={notiCheck}>
                <NotificationsIcon color="secondary" />
            </Badge>

        </React.Fragment>
    )
}

NotiBadge.defaultProps = {
    _onClick: () => {},
}

export default NotiBadge;