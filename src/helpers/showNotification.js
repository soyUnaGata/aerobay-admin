export let showNotification = (isVisibleRef) => {
    return new Promise((resolve) => {
        isVisibleRef.value = true;
        setTimeout(() => {
            isVisibleRef.value = false;
            resolve();
        }, 5000);
    });
};