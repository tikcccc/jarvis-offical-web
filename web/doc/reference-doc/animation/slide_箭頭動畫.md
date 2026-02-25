這是一個經典的「微互動」，Vibe Coding 流程會這樣做：

觸發：在 Slide 的父層容器 (<div>) 上使用 onMouseEnter 和 onMouseLeave 事件。

狀態：這兩個事件會切換一個 React 狀態（例如 isHovering）。

動畫 (<AnimatePresence>)：

箭頭按鈕會被 Framer Motion 的 <AnimatePresence> 元件包裹。

箭頭只在 isHovering 為 true 時才被渲染。

當 isHovering 變為 true 時，AnimatePresence 會觸發箭頭的 initial 和 animate 屬性，實現您說的「往上滑入動畫」（例如從 y: -20, opacity: 0 變為 y: 0, opacity: 1）。

當 isHovering 變為 false 時，AnimatePresence 會觸發 exit 屬性，實現「往下滑消失動畫」（例如變為 y: 20, opacity: 0）。