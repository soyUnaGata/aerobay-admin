export let showNotification = (isVisibleRef) => {
    isVisibleRef.value = true;
    setTimeout(() => {
        isVisibleRef.value = false;
    }, 5000);
};