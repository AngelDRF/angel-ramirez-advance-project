export const route = (router: any): void => {
  const currentPath = window.location.pathname;

  if (currentPath === "/") {
    router.push("/for-youPage");
  } else if (currentPath.startsWith("/bookPage/")) {
    router.push(currentPath);
  } else if (currentPath.startsWith("/settingsPage")) {
    router.push(currentPath);
  } else if (currentPath.startsWith("/playerPage")) {
    router.push(currentPath);
  } else {
    router.push("/for-youPage");
  }
};
