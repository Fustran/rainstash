import React, { useState, useCallback, useEffect, useContext } from 'react';
import { getBoolCookie, getOrCreateEnabledItems } from '../misc/cookie';
import mobileContext from './mobileContext';
import InfoPanel from './InfoPanel/InfoPanel';
import ItemPanel from './ItemPanel/ItemPanel';

const ItemPage = (props) => {
    const [hoveredItem, setHoveredItem] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [manifest, setManifest] = useState(null);

    //load manifests to a master manifest by combining them
    useEffect(() => {
        (async () => {
            //get manifests to load from cookies
            let manifestsToLoad; 
            //if mods are not enabled, just load vanilla
            if ( getBoolCookie('mods', false) === true ) {
                manifestsToLoad = getOrCreateEnabledItems(props.folderName);
                //make sure vanilla loads first
                manifestsToLoad = manifestsToLoad.sort((a) => a !== 'vanilla');
            } else {
                manifestsToLoad = ['vanilla'];
            }

            let combinedManifest = { 'items': {}, 'classInfo': {} };
            
            //go through all manifests to be loaded
            for (const manifestName of manifestsToLoad) {
                const result = await fetch(process.env.PUBLIC_URL + `items/${props.folderName}/${manifestName}/itemManifest.json`);
                const manifest = await result.json();
                //merge items and classes
                if (manifest.items) { 
                    //tag items with the manifest they came from before combining
                    for (const item of Object.values(manifest.items)) {
                        item.manifestName = manifestName;
                    }
                    Object.assign(combinedManifest.items, manifest.items);
                }
                // if (manifest.classInfo) { Object.assign(combinedManifest.classInfo, manifest.classInfo) }
                if (manifest.classInfo) {
                    for (const [key, value] of Object.entries(manifest.classInfo)) {
                        //add class if it doesn't exist
                        if (!combinedManifest.classInfo[key]) {
                            combinedManifest.classInfo[key] = value;
                        }
                    }
                }
                
            }
            setManifest(combinedManifest);
        })();
    }, [props.folderName]);

    //handlers for mousing over and off items
    const mouseOverHandler = useCallback((item) => {
        setHoveredItem(item);
    }, [setHoveredItem]);

    const mouseOutHandler = useCallback(() => {
        setHoveredItem(null); 
    }, []);

    //selection handler (clicking on an item)
    const mouseClickHandler = useCallback((item) => {
        if (selectedItem === null) {
            setSelectedItem(item);
        } else {
            if (selectedItem !== item) {
                setSelectedItem(item);
            } else {
                setSelectedItem(null);
            }
        }
    }, [selectedItem, setSelectedItem]);

    const clearSelectedItem = useCallback(() => {
        setSelectedItem(null);
    }, [setSelectedItem]);

    const item = hoveredItem ? hoveredItem : selectedItem;
    const isMobile = useContext(mobileContext);

    return (<>
        { (isMobile === false || (isMobile === true && selectedItem)) &&
            <InfoPanel
                item={item} 
                folderName={props.folderName} 
                clearSelectedItem={clearSelectedItem}
            />
        }
        { (isMobile === false || (isMobile === true && !selectedItem)) &&
            <ItemPanel
                selectedItem={selectedItem}
                manifest={manifest}
                folderName={props.folderName}
                searchString={props.searchString}
                onMouseOut={() => mouseOutHandler()}
                onMouseOver={item => mouseOverHandler(item)}
                onMouseClick={item => mouseClickHandler(item)}
            />
        }
    </>)
}

export default ItemPage;