// ==UserScript==
// @name         all-mai-friends
// @namespace    https://github.com/evnchn/all-mai-friends
// @version      0.11
// @description  Show all my friends on maimai DX net, at the same time (no pagination)
// @match        https://maimaidx-eng.com/maimai-mobile/friend/
// @match        https://maimaidx-eng.com/maimai-mobile/friend/
// @downloadURL  https://raw.githubusercontent.com/evnchn/all-mai-friends/main/all-mai-friends.userscript.js
// @updateURL    https://raw.githubusercontent.com/evnchn/all-mai-friends/main/all-mai-friends.userscript.js
// ==/UserScript==



(function () {
    'use strict';

    console.log("Begin amf");

    // Function to fetch and append elements for a specific id
    function fetchAndAppendElements(id) {
        return fetch('https://maimaidx-eng.com/maimai-mobile/friend/pages/?idx=' + id)
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const mainWrapper = doc.querySelector('.main_wrapper');
                const seeThroughBlocks = Array.from(mainWrapper.querySelectorAll('.see_through_block'));
                const seeThroughBlockList = seeThroughBlocks.map(element => element.cloneNode(true));

                // Append the elements in seeThroughBlockList to the current document's .main_wrapper
                const currentMainWrapper = document.querySelector('.main_wrapper');
                const allsee = currentMainWrapper.querySelectorAll('.see_through_block');
                const lastSeeThroughBlock = allsee[allsee.length - 1];
                if (lastSeeThroughBlock) {
                    seeThroughBlockList.forEach(element => {
                        currentMainWrapper.insertBefore(element, lastSeeThroughBlock.nextSibling);
                    });
                }

                // always refresh what-is-mai-name to be safe...
                try {
                    unsafeWindow.evnchn__what_is_mai_name_refresh();
                } catch (error) {
                    // do nothing is OK
                    console.log("Did not find what-is-mai-name refresh...");
                }

            })
            .catch(error => console.error('Error:', error));
    }

    // Function to perform sequential fetch and append for ids from startId to endId
    function fetchAndAppendSequentially(startId, endId) {
        let id = startId;

        function fetchNext() {
            if (id <= endId) {
                return fetchAndAppendElements(id++)
                    .then(fetchNext);
            }
        }

        return fetchNext();
    }

    // Call the fetchAndAppendSequentially function to perform the action
    const allidx = document.querySelectorAll("input[name='idx']");
    const end_limit = +allidx[allidx.length - 1].nextSibling.innerText.substring(1)
    if (end_limit >= 2) {
        fetchAndAppendSequentially(2, end_limit)
            .then(() => {
                console.log('Sequential fetching and appending completed.');
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    try {
        unsafeWindow.evnchn__what_is_mai_name_refresh();
    } catch (error) {
        // do nothing is OK
        console.log("Did not find what-is-mai-name refresh...");
    }

})();