import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

const PrintFunc = () => {
  const printRef = useRef(null);

  const handlePrint = useReactToPrint({ contentRef: printRef });

  return { printRef, handlePrint };
};
export default PrintFunc;
