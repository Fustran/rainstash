import React, { useContext } from 'react';
import InfoVideo from './InfoVideo';
import { getBoolCookie } from '../../misc/cookie';

import styles from './InfoPanel.module.css';
import mobileContext from '../mobileContext';

function InfoPanel({ item, folderName, clearSelectedItem }) {
    const isMobile = useContext(mobileContext);
    const closePanelHandler = () => {
        clearSelectedItem();
    }

    const content = () => {
        if (item !== null) {
            return (<>
                { isMobile === true &&
                    <img 
                        alt={'close button'}
                        src={'static/close3.png'}
                        className={styles.closeButton}
                        onClick={() => closePanelHandler()}
                    />
                }

                <div key='title' className={styles.infoTitle}>{item.name}</div>
                <img key='image'
                    className={styles.infoImage} 
                    alt={item.name} 
                    src={process.env.PUBLIC_URL + `/items/${folderName}/${item.manifestName}/itemIcons/${item.imgName}`}
                />

                {item.extraInfo && <>
                    <div key='extra' className={styles.infoSubtitle}>{item.extraInfo}</div>
                </>}

                {item.description && <>
                    {/* <div key='descTag' className={styles.infoSubtitle}>Description:</div> */}
                    <div key='desc'>{item.description}</div>
                </>}

                {item.stack && <>
                    <div key='stackTag' className={styles.infoSubtitle}>Stacking Effect:</div>
                    <div key='stack'>{item.stack}</div>
                </>}

                {item.embryo && <>
                    <div key='embryoTag' className={styles.infoSubtitle}>Beating Embryo Effect:</div>
                    <div key='embryo'>{item.embryo}</div>
                </>}

                {item.cooldown && <>
                    <div key='cooldownTag' className={styles.infoSubtitle}>Cooldown:</div>
                    <div key='cooldown'>{item.cooldown} seconds.</div>
                </>}

                {item.drop && <>
                    <div key='dropTag' className={styles.infoSubtitle}>Dropped By:</div>
                    <div key='drop'>{item.drop}</div>
                </>}

                {item.unlock && <>
                    <div key='unlockTag' className={styles.infoSubtitle}>Unlock:</div>
                    <div key='unlock'>{item.unlock}</div>
                </>}

                {(getBoolCookie('loadVideos', true) === true && (item.hasVideo === null || item.hasVideo !== false)) && <>
                    <span className={styles.spacer}></span>
                    <InfoVideo key='video' folderName={folderName} item={item} />
                </>}
            </>);
        } else {
            return null;
        }
    }

    return (
        <div className={styles.infoPanel}>
            {content()}
        </div>
    );
}

export default InfoPanel;