"use client";

import {getCitizenshipsQuery} from "../actions/citizenships";
import {useQuery} from "@tanstack/react-query";

export const useCitizenships = () => {
  console.log("useCitizenships called");
  const result = useQuery({
    queryKey: ["citizenships"],
    queryFn: () => getCitizenshipsQuery(),
  });
  console.log("result", result);
  return result;
};
