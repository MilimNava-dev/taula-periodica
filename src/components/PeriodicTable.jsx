import { useState } from "react";
import elements from "../data/periodic-table.json";
import { SearchCheck, ArrowBigLeftDash, NotebookPen } from "lucide-react";
import Element from "./Element";

export default function PeriodicTable() {
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [userInputs, setUserInputs] = useState({});

  // Estados para las 3 opciones requeridas
  const [onlyExamElements, setOnlyExamElements] = useState(false);
  const [showOxidationStates, setShowOxidationStates] = useState(false);
  const [practiceOxidationStates, setPracticeOxidationStates] = useState(false);

  const [selectedElements, setSelectedElements] = useState(
    elements.reduce((acc, el) => ({ ...acc, [el.num]: true }), {}),
  );

  const handleInputChange = (num, value) => {
    setUserInputs((prev) => ({
      ...prev,
      [num]: value,
    }));
  };

  const toggleSelection = (num) => {
    if (isPracticeMode) return;
    setSelectedElements((prev) => ({
      ...prev,
      [num]: !prev[num],
    }));
  };

  // Filtrar o seleccionar solo elementos del examen cuando se activa el checkbox
  const handleToggleExamElements = (checked) => {
    setOnlyExamElements(checked);
    if (checked) {
      const newSelection = {};
      elements.forEach((el) => {
        newSelection[el.num] = !!el.exam;
      });
      setSelectedElements(newSelection);
    } else {
      const newSelection = {};
      elements.forEach((el) => {
        newSelection[el.num] = true;
      });
      setSelectedElements(newSelection);
    }
  };

  const togglePracticeMode = () => {
    const hasSelected = Object.values(selectedElements).some((v) => v);
    if (!isPracticeMode && !hasSelected) {
      alert("Selecciona com a mínim un element per practicar");
      return;
    }

    setIsPracticeMode(!isPracticeMode);
    setShowResults(false);
    if (!isPracticeMode) {
      setUserInputs({});
    }
  };

  const checkResults = () => {
    setShowResults(true);
  };

  const selectedList = elements.filter((el) => selectedElements[el.num]);

  // Función helper fuera o dentro del componente para contar aciertos totales
  const checkValenciesCorrect = (input, valencies = []) => {
    if (!input && valencies.length === 0) return true;
    if (!input) return false;

    const parseInput = (str) =>
      str
        .trim()
        .toLowerCase()
        .split(/[\s,]+/)
        .filter(Boolean);

    const userVals = parseInput(input);
    const targetVals = valencies.flatMap((v) => parseInput(v));

    if (userVals.length !== targetVals.length) return false;

    const sortedUser = [...userVals].sort();
    const sortedTarget = [...targetVals].sort();

    return sortedUser.every((val, idx) => val === sortedTarget[idx]);
  };

  // Reemplaza el cálculo de correctCount por este:
  const correctCount = selectedList.filter((el) => {
    const input = userInputs[el.num] || "";
    if (practiceOxidationStates) {
      return checkValenciesCorrect(input, el.valencies);
    }
    return input.trim().toLowerCase() === el.symbol.toLowerCase();
  }).length;

  return (
    <div className="flex flex-col gap-4 p-16 max-w-[1200px] m-auto w-full">
      <div className="flex flex-col items-center w-full">
        <h1 className="text-2xl font-bold text-gray-800">
          Practicar Taula Periòdica
        </h1>

        {showResults && (
          <div className="mt-4 text-lg font-semibold animate-in fade-in zoom-in duration-300 bg-green-50 px-6 py-2 rounded-full border border-green-200">
            Resultats:{" "}
            <span
              className={
                correctCount / selectedList.length < 0.5
                  ? "text-red-600"
                  : correctCount / selectedList.length < 0.75
                    ? "text-amber-600"
                    : "text-green-600"
              }
            >
              {correctCount}
            </span>{" "}
            / {selectedList.length} encerts
          </div>
        )}

        <div className="grid grid-cols-18 gap-1 mt-4 w-full relative">
          {/* Panel de opciones situado en el hueco superior de la tabla periódica */}
          {!isPracticeMode && (
            <div className="col-start-4 col-span-6 row-start-2 row-span-2 flex flex-col justify-center items-start p-3 bg-gray-50 border border-gray-200 rounded-lg gap-2 my-auto">
              <label className="flex items-center gap-2 text-xs md:text-sm font-medium text-gray-700 cursor-pointer hover:text-gray-900">
                <input
                  type="checkbox"
                  checked={onlyExamElements}
                  onChange={(e) => {
                    handleToggleExamElements(e.target.checked);
                  }}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                />
                <span>Seleccionar elements més importants</span>
              </label>

              <label className="flex items-center gap-2 text-xs md:text-sm font-medium text-gray-700 cursor-pointer hover:text-gray-900">
                <input
                  type="checkbox"
                  checked={practiceOxidationStates}
                  onChange={(e) => {
                    setPracticeOxidationStates(e.target.checked);
                    setShowOxidationStates(e.target.checked);
                  }}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                />
                <span>Practicar estats d'oxidació</span>
              </label>
            </div>
          )}

          {elements.map((el) => (
            <Element
              key={el.num}
              el={el}
              isPracticeMode={isPracticeMode && selectedElements[el.num]}
              isSelected={selectedElements[el.num]}
              showResults={showResults}
              showOxidationStates={showOxidationStates}
              practiceOxidationStates={practiceOxidationStates}
              userInput={userInputs[el.num] || ""}
              onChange={(val) => handleInputChange(el.num, val)}
              onToggle={() => toggleSelection(el.num)}
            />
          ))}
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={togglePracticeMode}
            className={`px-4 py-2 text-white rounded-md transition-colors font-medium ${isPracticeMode
                ? "bg-red-500 hover:bg-red-600"
                : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            {isPracticeMode ? <ArrowBigLeftDash /> : <NotebookPen />}
          </button>
          {isPracticeMode && !showResults && (
            <button
              onClick={checkResults}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
            >
              <SearchCheck />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
