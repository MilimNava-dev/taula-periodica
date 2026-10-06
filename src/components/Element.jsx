import { typeColors } from "@/utils/colors";

export default function Element({
  el,
  isPracticeMode,
  isSelected,
  showResults,
  userInput,
  onChange,
  onToggle,
  showOxidationStates,
  practiceOxidationStates,
}) {
  // Función helper para comparar valencias sin importar el orden ni comas/espacios
  const checkValenciesCorrect = (input, valencies = []) => {
    // Si no hay valencias requeridas (ej: gases nobles) y el input está vacío, es correcto
    if (!input && valencies.length === 0) return true;
    if (!input) return false;

    // Normaliza separando por comas o espacios
    const parseInput = (str) =>
      str
        .trim()
        .toLowerCase()
        .split(/[\s,]+/) // Separa por comas o por espacios
        .filter(Boolean);

    const userVals = parseInput(input);
    const targetVals = valencies.flatMap((v) => parseInput(v));

    if (userVals.length !== targetVals.length) return false;

    // Ordenar y comparar arrays
    const sortedUser = [...userVals].sort();
    const sortedTarget = [...targetVals].sort();

    return sortedUser.every((val, idx) => val === sortedTarget[idx]);
  };

  // Evalúa el acierto según la modalidad activa
  const isCorrect = practiceOxidationStates
    ? checkValenciesCorrect(userInput, el.valencies)
    : userInput.trim().toLowerCase() === el.symbol.toLowerCase();

  let feedbackClass = "";
  if (showResults && isPracticeMode) {
    feedbackClass = isCorrect
      ? "bg-green-500 text-white border-green-700 shadow-inner"
      : "bg-red-500 text-white border-red-700 shadow-inner";
  }

  const baseClasses = `border rounded-sm flex flex-col items-center justify-center text-xs min-h-14 h-full w-full transition-all duration-200 cursor-pointer aspect-square p-0.5 relative`;
  const selectionClasses =
    !isSelected && !isPracticeMode
      ? "opacity-30 grayscale-[0.5] scale-95"
      : "scale-100";

  return (
    <div
      onClick={onToggle}
      style={{
        gridColumnStart: el.col,
        gridRowStart: el.row,
      }}
      className={`${baseClasses} ${selectionClasses} ${showResults && isPracticeMode
          ? feedbackClass
          : isSelected
            ? typeColors[el.type]
            : "bg-gray-100 border-gray-300"
        } ${!isPracticeMode ? "hover:scale-105 hover:shadow-lg hover:z-10 border-gray-400" : "border-gray-600"}`}
    >
      {isPracticeMode ? (
        <div
          className="flex flex-col items-center justify-between h-full w-full p-1"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="text-[9px] opacity-70 self-start leading-none">
            {el.num}
          </span>

          {practiceOxidationStates ? (
            /* Modo práctica de valencias: muestra el símbolo y pide las valencias */
            <>
              <span className="font-bold text-sm leading-none my-0.5">
                {el.symbol}
              </span>
              <input
                type="text"
                value={userInput}
                onChange={(e) => onChange(e.target.value)}
                disabled={showResults}
                placeholder="v."
                className={`w-full text-center bg-transparent border-b border-gray-400 focus:outline-none focus:border-white font-medium text-[10px] leading-tight ${showResults ? "placeholder-white" : ""
                  }`}
              />
              {showResults && !isCorrect && (
                <span className="text-[8px] font-black mt-0.5 truncate max-w-full animate-in slide-in-from-top-1">
                  {el.valencies?.join(",") || "Ø"}
                </span>
              )}
            </>
          ) : (
            /* Modo práctica de símbolos (modo por defecto) */
            <>
              <input
                type="text"
                value={userInput}
                onChange={(e) => onChange(e.target.value)}
                disabled={showResults}
                autoFocus={el.num === 1}
                className={`w-full text-center bg-transparent border-b border-gray-400 focus:outline-none focus:border-white font-bold text-sm ${showResults ? "placeholder-white" : ""
                  }`}
                maxLength={3}
              />
              {showResults && !isCorrect && (
                <span className="text-[10px] font-black mt-0.5 animate-in slide-in-from-top-1">
                  {el.symbol}
                </span>
              )}
            </>
          )}
        </div>
      ) : (
        /* Modo visualización de la tabla */
        <>
          <span className="text-[9px] self-start ml-1 opacity-60 font-medium leading-none">
            {el.num}
          </span>
          <span className="font-bold text-base leading-none my-0.5">
            {el.symbol}
          </span>
          {isSelected && (
            <span className="text-[8px] opacity-50 truncate px-1 font-semibold leading-tight">
              {showOxidationStates && el.valencies
                ? el.valencies.join(" ")
                : el.name}
            </span>
          )}
        </>
      )}
    </div>
  );
}
