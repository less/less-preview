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
  promises: "2.0.0"
};

class lessFeatures {
  static hasPromises() {
    return compareVersions(lessOptions.version, addedIn.promises);
  }
}

export { lessFeatures as default };
