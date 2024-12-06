var req = require.context('./components', true, /\.vue$/);
const requireAll = requireContext => requireContext.keys().map(requireContext);

const moduleObject = {};
const moduleList = requireAll(req);
for (const { default: _default } of moduleList) {
  moduleObject[_default.name] = _default;
}
export default moduleObject;
