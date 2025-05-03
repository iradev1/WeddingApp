import { useEffect, useState } from "react";

export default function InspectWarningModal() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const showWarning = () => setVisible(true);

    const onKeyDown = (e) => {
      if (
        e.keyCode === 123 || // F12
        (e.ctrlKey && e.shiftKey && [73, 74, 67].includes(e.keyCode)) || // Ctrl+Shift+I/J/C
        (e.ctrlKey && e.keyCode === 85) // Ctrl+U
      ) {
        e.preventDefault();
        showWarning();
      }
    };

    const onContextMenu = (e) => {
      e.preventDefault();
      showWarning();
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("contextmenu", onContextMenu);

    const originalLog = console.log;
    console.log = function () {
      showWarning();
      originalLog("Inspection is not allowed on this page.");
    };

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("contextmenu", onContextMenu);
      console.log = originalLog;
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.85)",
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "#111",
          border: "2px solid #d4af37",
          borderRadius: "10px",
          padding: "30px",
          maxWidth: "400px",
          textAlign: "center",
          boxShadow: "0 5px 15px rgba(0,0,0,0.5)",
        }}
      >
        <h2
          style={{ color: "#d4af37", marginBottom: "15px", fontSize: "24px" }}
        >
          Warning!
        </h2>
        <p style={{ color: "#fff", marginBottom: "20px", fontSize: "16px" }}>
          Dont do that, Please !!!.
        </p>
        <button
          onClick={() => setVisible(false)}
          style={{
            backgroundColor: "#d4af37",
            color: "#000",
            border: "none",
            padding: "10px 30px",
            borderRadius: "25px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          OK
        </button>
      </div>
    </div>
  );
}
