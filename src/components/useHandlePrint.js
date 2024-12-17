import { useReactToPrint } from 'react-to-print';

const useHandlePrint = (ref) => {
    console.log("Called")
  return useReactToPrint({
    content: () => ref.current,
  });
};

export default useHandlePrint;
