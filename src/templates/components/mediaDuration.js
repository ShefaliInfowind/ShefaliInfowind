import React, { useEffect, useState } from "react";

export const MediaDuration = (props) => {
    const [duration, setDuration] = useState('');

    useEffect(() => {

        if (props.mediaURL !== '') {

            var mediaURL = new Audio(props.mediaURL);
            mediaURL.addEventListener('loadedmetadata', (e) => {
                var d = new Date(e.target.duration * 1000).toISOString().substr(14, 5)
                setDuration(d);
            });
        }
    }, [props]);


    return (
        <>
            {duration}
        </>
    );
}

