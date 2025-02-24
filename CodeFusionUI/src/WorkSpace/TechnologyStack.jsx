import { useCallback, useState } from "react";

function TechnologyStack({ setDisplay, display }) {
  const [selected, setSelected] = useState("");

  const technologies = [
    { name: "HTML", id: "html" },
    { name: "Go", id: "go" },
    { name: "Java", id: "java" },
    { name: "Ruby", id: "ruby" },
    { name: "Python", id: "python" },
    { name: "C", id: "C" },
    { name: "C++", id: "C++" },
  ];

  const handleSelect = useCallback((techId) => {
    setSelected(techId);
  }, []);

  const handleCancel = useCallback(() => {
    setDisplay("none"); // Hide the TechnologyStack when Cancel is clicked
  }, [setDisplay]);

  const handlePrev = () => {
    setDisplay("none"); // Hide TechnologyStack when Prev is clicked
  };

  return (
    <div className="workspace-container1" style={{ display: display }}>
      <p className="workspace-title">Select a Technology Stack:</p>
      <div className="tech-grid">
        {technologies.map((tech) => (
          <div
            key={tech.id}
            className={`tech-box ${selected === tech.id ? "selected" : ""}`}
            onClick={() => handleSelect(tech.id)}
          >
            <span className="tech-name">{tech.name}</span>
            {selected === tech.id && <span className="checkmark">✓</span>}
          </div>
        ))}
      </div>
      <div className="button-group">
        <button type="button" className="btn btn-cancel" onClick={handleCancel}>
          <span className="btn-text">Cancel</span>
          <span className="btn-shine"></span>
        </button>
        <button type="button" className="btn btn-prev" onClick={handlePrev}>
          <span className="btn-text">Prev</span>
          <span className="btn-shine"></span>
        </button>
        <button type="button" className="btn btn-next">
          <span className="btn-text">Create</span>
          <span className="btn-shine"></span>
        </button>
      </div>
    </div>
  );
}

export default TechnologyStack;