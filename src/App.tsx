import * as React from 'react';

export const App: React.SFC<{}> = () => {
    const openTab = () => {
        chrome.tabs.create({ url: 'https://mail.google.com/mail/' });
    };

    return (
        <>
            <button onClick={() => openTab()}>Open</button>
        </>
    );
};
