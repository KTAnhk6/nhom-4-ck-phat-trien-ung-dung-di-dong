/**
 * Bản web: kéo bằng chuột để cuộn ngang. Sau khi kéo thì chặn click
 * để không vô tình mở thẻ bên dưới.
 */

import React, { useEffect, useRef } from 'react';
import { ScrollView, ScrollViewProps } from 'react-native';

const DRAG_THRESHOLD = 5;

export const DragScrollView: React.FC<ScrollViewProps> = props => {
  const ref = useRef<any>(null);

  useEffect(() => {
    const el: HTMLElement | undefined = ref.current?.getScrollableNode?.();
    if (!el) return;

    let down = false;
    let moved = false;
    let startX = 0;
    let startScroll = 0;

    const onDown = (e: MouseEvent) => {
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
      }
      if (moved) el.scrollLeft = startScroll - dx;
    };
    const onUp = () => {
      down = false;
      el.style.cursor = 'grab';
    };
    const onClickCapture = (e: MouseEvent) => {
      if (moved) {
        e.stopPropagation();
        e.preventDefault();
        moved = false;
      }
    };
    const onDragStart = (e: Event) => e.preventDefault();

    el.style.cursor = 'grab';
    el.addEventListener('mousedown', onDown);
    el.addEventListener('click', onClickCapture, true);
    el.addEventListener('dragstart', onDragStart);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      el.removeEventListener('mousedown', onDown);
      el.removeEventListener('click', onClickCapture, true);
      el.removeEventListener('dragstart', onDragStart);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  return <ScrollView ref={ref} {...props} />;
};
