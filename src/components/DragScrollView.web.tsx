/**
 * Bản web: kéo bằng chuột để cuộn ngang hoặc lăn con lăn chuột.
 * Sau khi kéo thì chặn click để không vô tình mở thẻ bên dưới.
 */

import React, { useEffect, useRef } from 'react';
import { ScrollView, ScrollViewProps } from 'react-native';

const DRAG_THRESHOLD = 5;

export const DragScrollView = React.forwardRef<any, ScrollViewProps>((props, forwardedRef) => {
  const innerRef = useRef<any>(null);

  useEffect(() => {
    const getEl = (): HTMLElement | null => {
      const target = innerRef.current;
      if (!target) return null;
      if (target instanceof HTMLElement) return target;
      if (typeof target.getScrollableNode === 'function') {
        const node = target.getScrollableNode();
        if (node instanceof HTMLElement) return node;
      }
      if (target._nativeNode instanceof HTMLElement) return target._nativeNode;
      return null;
    };

    const el = getEl();
    if (!el) return;

    let down = false;
    let moved = false;
    let startX = 0;
    let startScroll = 0;

    const onDown = (e: MouseEvent) => {
      if (e.button !== 0) return; // Chỉ chuột trái
      down = true;
      moved = false;
      startX = e.pageX;
      startScroll = el.scrollLeft;
    };

    const onMove = (e: MouseEvent) => {
      if (!down) return;
      const dx = e.pageX - startX;
      if (!moved && Math.abs(dx) > DRAG_THRESHOLD) {
        moved = true;
        el.style.cursor = 'grabbing';
        el.style.userSelect = 'none';
      }
      if (moved) {
        el.scrollLeft = startScroll - dx;
      }
    };

    const onUp = () => {
      down = false;
      el.style.cursor = 'grab';
      el.style.removeProperty('user-select');
    };

    const onClickCapture = (e: MouseEvent) => {
      if (moved) {
        e.stopPropagation();
        e.preventDefault();
        moved = false;
      }
    };

    const onWheel = (e: WheelEvent) => {
      // Khi con lăn chuột cuộn dọc trong vùng cuộn ngang, chuyển thành cuộn ngang
      if (e.deltaY !== 0 && el.scrollWidth > el.clientWidth) {
        el.scrollLeft += e.deltaY;
      }
    };

    const onDragStart = (e: Event) => e.preventDefault();

    el.style.cursor = 'grab';
    el.addEventListener('mousedown', onDown);
    el.addEventListener('click', onClickCapture, true);
    el.addEventListener('dragstart', onDragStart);
    el.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);

    return () => {
      el.removeEventListener('mousedown', onDown);
      el.removeEventListener('click', onClickCapture, true);
      el.removeEventListener('dragstart', onDragStart);
      el.removeEventListener('wheel', onWheel);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  return (
    <ScrollView
      ref={node => {
        innerRef.current = node;
        if (typeof forwardedRef === 'function') {
          forwardedRef(node);
        } else if (forwardedRef) {
          (forwardedRef as any).current = node;
        }
      }}
      {...props}
    />
  );
});
