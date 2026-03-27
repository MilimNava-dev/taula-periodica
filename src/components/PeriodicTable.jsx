import { useState } from "react"
import elements from "../data/periodic-table.json"
import { SearchCheck, ArrowBigLeftDash, NotebookPen } from 'lucide-react';
import Element from "./Element"

export default function PeriodicTable() {
  const [isPracticeMode, setIsPracticeMode] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [userInputs, setUserInputs] = useState({})
  const [selectedElements, setSelectedElements] = useState(
    elements.reduce((acc, el) => ({ ...acc, [el.num]: true }), {})
  )

  const handleInputChange = (num, value) => {
    setUserInputs(prev => ({
      ...prev,
      [num]: value
    }))
  }

  const toggleSelection = (num) => {
    if (isPracticeMode) return
    setSelectedElements(prev => ({
      ...prev,
      [num]: !prev[num]
    }))
  }

  const togglePracticeMode = () => {
    const hasSelected = Object.values(selectedElements).some(v => v)
    if (!isPracticeMode && !hasSelected) {
      alert("Selecciona al menos un elemento para practicar")
      return
    }

    setIsPracticeMode(!isPracticeMode)
    setShowResults(false)
    if (!isPracticeMode) {
      setUserInputs({})
    }
  }

  const checkResults = () => {
    setShowResults(true)
  }

  const selectedList = elements.filter(el => selectedElements[el.num])

  const correctCount = selectedList.filter(el => 
    userInputs[el.num]?.trim().toLowerCase() === el.symbol.toLowerCase()
  ).length

  return (
    <div className="flex flex-col gap-4 max-w-[1000px] m-auto w-full">
      <div className="flex flex-col items-center w-full">
        <h1 className="text-2xl font-bold text-gray-800">Practicar Taula Periòdica</h1>
        {/* <p className="text-sm text-gray-600 max-w-md text-center">
          {isPracticeMode
             ? "Escribe el símbolo de los elementos seleccionados." 
             : "Haz clic en los elementos para seleccionarlos/deseleccionarlos del examen."}
        </p> */}

        {showResults && (
          <div className="mt-4 text-lg font-semibold animate-in fade-in zoom-in duration-300 bg-green-50 px-6 py-2 rounded-full border border-green-200">
            Resultado: <span className={correctCount / selectedList.length < 0.5 ? "text-red-600" : (correctCount / selectedList.length < 0.75 ? "text-amber-600" : "text-green-600")}>{correctCount}</span> / {selectedList.length} correctas
          </div>
        )}

      <div className="grid grid-cols-18 gap-1 mt-4 w-full">
        {elements.map(el => (
          <Element
            key={el.num}
            el={el}
            isPracticeMode={isPracticeMode && selectedElements[el.num]}
            isSelected={selectedElements[el.num]}
            showResults={showResults}
            userInput={userInputs[el.num] || ""}
            onChange={(val) => handleInputChange(el.num, val)}
            onToggle={() => toggleSelection(el.num)}
          />
        ))}
      </div>
      <div className="flex gap-2 mt-6">
          <button
            onClick={togglePracticeMode}
            className={`px-4 py-2 text-white rounded-md transition-colors font-medium ${
              isPracticeMode ? "bg-red-500 hover:bg-red-600" : "bg-blue-600 hover:bg-blue-700"
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
  )
}
