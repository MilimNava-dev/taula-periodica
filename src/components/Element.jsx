import { typeColors } from "@/utils/colors"

export default function Element({ el, isPracticeMode, isSelected, showResults, userInput, onChange, onToggle }) {
  const isCorrect = userInput.trim().toLowerCase() === el.symbol.toLowerCase()

  let feedbackClass = ""
  if (showResults && isPracticeMode) {
    feedbackClass = isCorrect 
      ? "bg-green-500 text-white border-green-700 shadow-inner" 
      : "bg-red-500 text-white border-red-700 shadow-inner"
  }

  const baseClasses = `border rounded-sm flex flex-col items-center justify-center text-xs h-14 w-full transition-all duration-200 cursor-pointer aspect-square`
  const selectionClasses = !isSelected && !isPracticeMode ? "opacity-30 grayscale-[0.5] scale-95" : "scale-100"

  return (
    <div
      onClick={onToggle}
      style={{
        gridColumnStart: el.col,
        gridRowStart: el.row
      }}
      className={`${baseClasses} ${selectionClasses} ${
        showResults && isPracticeMode ? feedbackClass : (isSelected ? typeColors[el.type] : "bg-gray-100 border-gray-300")
      } ${!isPracticeMode ? "hover:scale-105 hover:shadow-lg hover:z-10 border-gray-400" : "border-gray-600"}`}
    >
      {isPracticeMode ? (
        <div className="flex flex-col items-center w-full px-1" onClick={(e) => e.stopPropagation()}>
          <span className="text-[10px] opacity-70 mb-0.5">{el.num}</span>
          <input
            type="text"
            value={userInput}
            onChange={(e) => onChange(e.target.value)}
            disabled={showResults}
            autoFocus={el.num === 1}
            className={`w-full text-center bg-transparent border-b border-gray-400 focus:outline-none focus:border-white font-bold text-sm ${
              showResults ? "placeholder-white" : ""
            }`}
            maxLength={3}
          />
          {showResults && !isCorrect && (
            <span className="text-[10px] font-black mt-0.5 animate-in slide-in-from-top-1">{el.symbol}</span>
          )}
        </div>
      ) : (
        <>
          <span className="text-[9px] self-start ml-1 opacity-60 font-medium">{el.num}</span>
          <span className="font-bold text-base">{el.symbol}</span>
          {isSelected && <span className="text-[8px] opacity-50 truncate px-1">{el.name}</span>}
        </>
      )}
    </div>
  )
}
