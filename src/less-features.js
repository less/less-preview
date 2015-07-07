import lessOptions from 'less-options';

function compareVersions(current, featureVersion) {
  current = current.split(".");
  featureVersion = featureVersion.split(".");

  for(var i = 0; i < featureVersion.length; i++) {
    const featurePart = Number(featureVersion[i]),
        currentPart = Number(current[i]);
    if (featurePart === currentPart) {
      continue;
    }
    return featurePart < currentPart;
  }
  return true;
}

const addedIn = {
  promises: "2.0.0",
  outputLineNumbers: "1.3.1"
};

function has(feature) {
  return compareVersions(lessOptions.version, feature);
}

class lessFeatures {
  static hasPromises() {
    return has(addedIn.promises);
  }
  static hasOutputLineNumbers() {
    return has(addedIn.outputLineNumbers);
  }
}

export { lessFeatures as default };
