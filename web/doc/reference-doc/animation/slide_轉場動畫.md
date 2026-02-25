(滑動動畫)：

Framer Motion + <AnimatePresence> 會這樣做：

[Exit] Interoperability 的內容會「向左滑出」（例如 opacity: 0, x: -50）。

[Enter] Maven 的內容會從「右側滑入」（例如 initial={{ opacity: 0, x: 50 }} 變為 animate={{ opacity: 1, x: 0 }}）。

結果： 這就創造了一個非常流暢、有方向感的「水平滑動」轉場效果，讓使用者感覺他們是在一個水平的「功能時間軸」上移動，這比單純的淡入淡出要精緻得多。