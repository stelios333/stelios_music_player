function initIndexedDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('music_player', 1);

        request.onupgradeneeded = function (event) {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('songs')) {
                db.createObjectStore('songs', { keyPath: 'id' });
            }
        };

        request.onsuccess = function (event) {
            resolve(event.target.result);
        };

        request.onerror = function (event) {
            reject(event.target.error);
        };
    });
}

function saveSongToIndexedDB(blob, id) {
    return new Promise((success, fail) => {
        initIndexedDB().then(db => {
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(['songs'], 'readwrite');
                const store = transaction.objectStore('songs');
                const request = store.put({ id, blob });

                request.onsuccess = function () {
                    resolve();
                };

                request.onerror = function (event) {
                    reject(event.target.error);
                };
            })
        }).then(() => {
            console.log('Song saved to IndexedDB');
            success()
        }).catch(error => {
            fail(error)
        });
    })
}

function removeSongFromIndexedDB(id) {

    initIndexedDB().then(db => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['songs'], 'readwrite');
            const store = transaction.objectStore('songs');
            const request = store.delete(id)

            request.onsuccess = function () {
                resolve();
            };

            request.onerror = function (event) {
                reject(event.target.error);
            };
        })
    }).then(() => {
        console.log('Song removed from IndexedDB');
    }).catch(error => {
        console.log("Error removing song from IndexedDB:", error);
    });

}

function removeAllSongsFromIndexedDB() {
    initIndexedDB().then(db => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['songs'], 'readwrite');
            const store = transaction.objectStore('songs');
            const request = store.clear()

            request.onsuccess = function () {
                resolve();
            };

            request.onerror = function (event) {
                reject(event.target.error);
            };
        })
    }).then(() => {
        console.log('Successfully cleared IndexedDB.');
    }).catch(error => {
        alert("Error deleting songs from IndexedDB: " + error);
    });

}

function getAllSongsFromIndexedDB() {
    return new Promise((success, fail) => {
        initIndexedDB().then(db => {
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(['songs'], 'readwrite');
                const store = transaction.objectStore('songs');
                const request = store.getAll()

                request.onsuccess = function () {
                    resolve(request);
                };

                request.onerror = function (event) {
                    reject(event.target.error);
                };
            })
        }).then((i) => {
            success(i.result)
        }).catch(error => {
            fail(error);
        });
    })
}

function getSongFromIndexedDB(id) {
    return new Promise((success, fail) => {
        initIndexedDB().then(db => {
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(['songs'], 'readwrite');
                const store = transaction.objectStore('songs');
                const request = store.get(id)

                request.onsuccess = function () {
                    resolve(request);
                };

                request.onerror = function (event) {
                    reject(event.target.error);
                };
            })
        }).then((i) => {
            success(i.result)
        }).catch(error => {
            fail(error);
        });
    })
}

function addSongPromise(song, store) {
    return new Promise((resolve, reject) => {
        const request = store.add(song)
        request.onsuccess = (event) => {
            resolve()
        }
        request.onerror = function (event) {
            reject(event.target.error);
        }
    })
}

function replaceAllIndexedDB(song_array) {
    initIndexedDB().then(db => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['songs'], 'readwrite');
            const store = transaction.objectStore('songs');
            const request = store.clear()

            request.onsuccess = async function () {

                for (const song of song_array) {
                    console.log(song)
                    const a = await addSongPromise(song, store)
                }
                resolve()

            };

            request.onerror = function (event) {
                reject(event.target.error);
            };
        })
    }).then(() => {
        console.log("Successfully replaced everything in database")
    }).catch(error => {
        alert("Failed to replace all: " + error);
    });

}