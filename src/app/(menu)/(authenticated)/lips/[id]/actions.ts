export function checkIfFiscalCodeExists(): Promise<{
  lastLip: {agentId: number} | null;
}> {
  // Fake server request
  return new Promise((resolve) => {
    setTimeout(() => {
      const random = Math.random();
      if (random < 0.8) {
        resolve({lastLip: {agentId: 2}});
      } else if (random < 0.9) {
        resolve({lastLip: {agentId: 1}});
      } else {
        resolve({lastLip: null});
      }
    }, 1000);
  });
}

export function fakeActivateContractorPersonalArea(): Promise<boolean> {
  // Fake server request
  return new Promise((resolve) => {
    resolve(true);
  });
}
