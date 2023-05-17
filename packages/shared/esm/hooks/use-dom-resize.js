import { onMounted, onUnmounted } from 'vue';

const useObserveDomResize = (container, cb) => {
  onMounted(() => {
    const domList = [].concat(container());
    const cbList = [].concat(cb);
    const resizeObserver = new ResizeObserver((entries) => requestAnimationFrame(() => {
      entries.forEach((entry, i) => {
        const cb2 = cbList[i];
        if (cb2 && typeof cb2 === "function") {
          cb2(entry);
        }
      });
    }));
    domList.forEach((dom) => {
      resizeObserver.observe(dom);
    });
    onUnmounted(() => {
      resizeObserver.disconnect();
    });
  });
};

export { useObserveDomResize };
