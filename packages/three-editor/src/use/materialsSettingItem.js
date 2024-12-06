import { ref, computed } from 'vue';
import { useScene } from '@use/sceneStore.js';
import { useSceneStore } from '@stores/scene.js';
import { useEditor } from '@use/useEditorStore.js';
export function useMaterialsSettingItem() {
  const sceneStore = useSceneStore();
  const editor = useEditor();
  const { currentMaterial } = useScene();
  const colorKey = computed(() => `${currentMaterial.value.uuid}_${currentMaterial.value.materialLibraryUUid}`);
  const fileImageData = computed(() => {
    return {
      value: currentMaterial.value.image,
      isTexture: false,
      title: currentMaterial.value.name,
      des: editor.currentMaterialDes.value
    };
  });
  // const fileImageChange = ({ currentFile }) => {
  //   switch (currentFile.status) {
  //     case 'error':
  //     case 'done':
  //       modelMaterialChange('image', currentFile);
  //       break;

  //     default:
  //       break;
  //   }
  // };
  const colorData = computed(() => {
    return {
      label: '颜色',
      type: 'color',
      value: currentMaterial.value.color,
      key: colorKey.value
    };
  });
  const reflectivityData = computed(() => {
    return {
      label: '反射率',
      type: 'slider',
      value: currentMaterial.value.reflectivity,
      showInput: true,
      max: 1,
      min: 0,
      step: 0.01
    };
  });
  const reflectivityTips =
    '反射率，由0.0到1.0。默认为0.5, 相当于折射率1.5。这模拟了非金属材质的反射率。当metalness为1.0时，此属性无效。';
  const iorData = computed(() => {
    return {
      label: '折射率',
      type: 'slider',
      value: currentMaterial.value.ior,
      showInput: true,
      max: 2.33,
      min: 1,
      step: 0.01
    };
  });
  const iorTips = '为非金属材质所设置的折射率，范围由1.0到2.333。默认为1.5。';

  const roughnessData = computed(() => {
    return {
      label: '粗糙度',
      type: 'slider',
      value: currentMaterial.value.roughness,
      showInput: true,
      max: 1,
      min: 0,
      step: 0.01
    };
  });
  const roughnessTips =
    '材质的粗糙程度。0.0表示平滑的镜面反射，1.0表示完全漫反射。默认值为1.0。如果还提供roughnessMap，则两个值相乘。';
  const metalnessData = computed(() => {
    return {
      label: '金属度',
      type: 'slider',
      value: currentMaterial.value.metalness,
      showInput: true,
      max: 1,
      min: 0,
      step: 0.01
    };
  });
  const metalnessTips =
    '材质与金属的相似度。非金属材质，如木材或石材，使用0.0，金属使用1.0，通常没有中间值。 默认值为0.0。0.0到1.0之间的值可用于生锈金属的外观。如果还提供了metalnessMap，则两个值相乘。';
  const clearcoatData = computed(() => {
    return {
      label: '清漆强度',
      type: 'slider',
      value: currentMaterial.value.clearcoat,
      showInput: true,
      max: 1,
      min: 0,
      step: 0.01
    };
  });
  const clearcoatTips =
    '表示clear coat层的强度，范围从0.0到1.0m，当需要在表面加一层薄薄的半透明材质的时候，可以使用与clear coat相关的属性，默认为0.0;';
  const clearcoatRoughnessData = computed(() => {
    return {
      label: '清漆粗糙度',
      type: 'slider',
      value: currentMaterial.value.clearcoatRoughness,
      showInput: true,
      max: 1,
      min: 0,
      step: 0.01
    };
  });
  const clearcoatRoughnessTips = 'clear coat层的粗糙度，由0.0到1.0。 默认为0.0';
  const iridescenceData = computed(() => {
    return {
      label: '彩虹色',
      type: 'slider',
      value: currentMaterial.value.iridescence,
      showInput: true,
      max: 1,
      min: 0,
      step: 0.01
    };
  });
  const iridescenceIORData = computed(() => {
    return {
      label: '彩虹折射率',
      type: 'slider',
      value: currentMaterial.value.iridescenceIOR,
      showInput: true,
      max: 5,
      min: 1,
      step: 0.01
    };
  });
  const sheenData = computed(() => {
    return {
      label: '光泽强度',
      type: 'slider',
      value: currentMaterial.value.sheen,
      showInput: true,
      max: 1,
      min: 0,
      step: 0.01
    };
  });
  const sheenTips = '光泽层的强度,范围是0.0到1.0。默认为0.0。';
  const sheenChange = val => {
    modelMaterialChange('sheen', val);
  };
  const sheenRoughnessData = computed(() => {
    return {
      label: '光泽粗糙度',
      type: 'slider',
      value: currentMaterial.value.sheenRoughness,
      showInput: true,
      max: 1,
      min: 0,
      step: 0.01
    };
  });
  const sheenRoughnessTips = '光泽层的粗糙度，由0.0到1.0。默认值是1.0。';
  const sheenRoughnessChange = val => {
    modelMaterialChange('sheenRoughness', val);
  };

  const materialTypeOptions = ref([
    {
      value: 'MeshBasicMaterial',
      label: '基础网格材质'
    },
    // {
    //   value: 'MeshDepthMaterial',
    //   label: '深度网格材质'
    // },
    // {
    //   value: 'MeshNormalMaterial',
    //   label: '法线网格材质'
    // },
    // {
    //   value: 'MeshLambertMaterial',
    //   label: 'Lambert网格材质'
    // },
    // {
    //   value: 'MeshMatcapMaterial',
    //   label: 'MeshMatcap材质'
    // },
    // {
    //   value: 'MeshPhongMaterial',
    //   label: 'Phong网格材质'
    // },
    // {
    //   value: 'MeshToonMaterial',
    //   label: '卡通材质'
    // },
    {
      value: 'MeshStandardMaterial',
      label: '标准网格材质'
    },
    {
      value: 'MeshPhysicalMaterial',
      label: '物理网格材质'
    }
    // {
    //   value: 'RawShaderMaterial',
    //   label: '原始着色器材质'
    // },
    // {
    //   value: 'ShaderMaterial',
    //   label: '着色器材质'
    // },
    // {
    //   value: 'ShadowMaterial',
    //   label: '阴影材质'
    // }
  ]);
  const sideOptions = ref([
    {
      value: 0,
      label: '正面'
    },
    {
      value: 1,
      label: '后面'
    },
    {
      value: 2,
      label: '双面'
    }
  ]);
  const blendingOptions = ref([
    {
      value: 0,
      label: 'NoBlending'
    },
    {
      value: 1,
      label: 'NormalBlending'
    },
    {
      value: 2,
      label: 'AdditiveBlending'
    },
    {
      value: 3,
      label: 'SubtractiveBlending'
    },
    {
      value: 4,
      label: 'MultiplyBlending'
    },
    {
      value: 5,
      label: 'CustomBlending'
    }
  ]);
  const materialTypeData = computed(() => {
    return {
      type: 'select',
      value: currentMaterial.value.type,
      options: materialTypeOptions.value,
      allowSearch: true,
      bordered: false
    };
  });
  const sideData = computed(() => {
    return {
      type: 'select',
      label: '面',
      value: currentMaterial.value.side,
      options: sideOptions.value,
      allowSearch: true,
      bordered: false
    };
  });
  const blendingData = computed(() => {
    return {
      type: 'select',
      label: '混合',
      value: currentMaterial.value.blending,
      options: blendingOptions.value,
      allowSearch: true,
      bordered: false
    };
  });
  const sideChange = val => {
    modelMaterialChange('side', parseInt(val));
  };
  const blendingChange = val => {
    modelMaterialChange('blending', parseInt(val));
  };

  const materialTypeChange = val => {
    sceneStore.changeMaterialType(val);
  };
  const reflectivityChange = val => {
    modelMaterialChange('reflectivity', val);
  };
  const colorChange = val => {
    const color = val;
    modelMaterialChange('color', color);
  };
  const iorChange = val => {
    modelMaterialChange('ior', val);
  };
  const roughnessChange = val => {
    modelMaterialChange('roughness', val);
  };
  const metalnessChange = val => {
    modelMaterialChange('metalness', val);
  };
  const clearcoatChange = val => {
    modelMaterialChange('clearcoat', val);
  };
  const clearcoatRoughnessChange = val => {
    modelMaterialChange('clearcoatRoughness', val);
  };
  const iridescenceChange = val => {
    modelMaterialChange('iridescence', val);
  };
  const iridescenceIORChange = val => {
    modelMaterialChange('iridescenceIOR', val);
  };

  const sheenColorData = computed(() => {
    return {
      label: '光泽颜色',
      type: 'color',
      value: currentMaterial.value.sheenColor,
      key: colorKey.value
    };
  });
  const sheenColorTips = '光泽颜色，默认为0x000000黑色';
  const sheenColorChange = val => {
    const color = val;
    modelMaterialChange('sheenColor', color);
  };

  const transmissionData = computed(() => {
    return {
      label: '透光率',
      type: 'slider',
      value: currentMaterial.value.transmission,
      showInput: true,
      max: 1,
      min: 0,
      step: 0.01
    };
  });
  const transmissionTips = `透光率（或者说透光性），范围从0.0到1.0。默认值是0.0。
  很薄的透明或者半透明的塑料、玻璃材质即便在几乎完全透明的情况下仍旧会保留反射的光线，透光性属性用于这种类型的材质。
  当透光率不为0的时候, opacity透明度应设置为1.`;
  const transmissionChange = val => {
    modelMaterialChange('transmission', val);
  };

  const emissiveData = computed(() => {
    return {
      label: '自发光颜色',
      type: 'color',
      value: currentMaterial.value.emissive,
      key: colorKey.value
    };
  });
  const emissiveTips = `材质的放射（光）颜色，基本上是不受其他光照影响的固有颜色。默认为黑色。.`;
  const emissiveChange = val => {
    const color = val;
    modelMaterialChange('emissive', color);
  };

  const emissiveIntensityData = computed(() => {
    return {
      label: '自发光强度',
      type: 'slider',
      value: currentMaterial.value.emissiveIntensity,
      showInput: true,
      max: 1,
      min: 0,
      step: 0.01
    };
  });
  const emissiveIntensityTips = `放射光强度。调节发光颜色。默认为1。`;
  const emissiveIntensityChange = val => {
    modelMaterialChange('emissiveIntensity', val);
  };

  const attenuationDistanceData = computed(() => {
    return {
      label: '衰减距离',
      type: 'slider',
      value: currentMaterial.value.attenuationDistance,
      showInput: true,
      min: 1,
      step: 0.01
    };
  });
  const attenuationDistanceTips = `介质的密度，以光与粒子相互作用之前在介质中传播的平均距离给出。 该值以世界空间单位给出，并且必须大于零。 默认为无穷大。`;
  const attenuationDistanceChange = val => {
    modelMaterialChange('attenuationDistance', val);
  };

  const attenuationColorData = computed(() => {
    return {
      label: '衰减色',
      type: 'color',
      value: currentMaterial.value.attenuationColor,
      key: colorKey.value
    };
  });
  const attenuationColorTips = `白光到达衰减距离时因吸收而变成的颜色。 默认为白色 (0xffffff)。`;
  const attenuationColorChange = val => {
    const color = val;
    modelMaterialChange('attenuationColor', color);
  };

  const thicknessData = computed(() => {
    return {
      label: '厚度',
      type: 'slider',
      value: currentMaterial.value.thickness,
      showInput: true,
      min: 0,
      step: 1
    };
  });
  const thicknessTips = `表面下方体积的厚度。 该值在网格的坐标空间中给出。 如果该值为 0，则材料为薄壁。 否则，材料是体积边界。 默认值为 0。`;
  const thicknessChange = val => {
    modelMaterialChange('thickness', val);
  };

  const vertexColorsData = computed(() => {
    return {
      label: '顶点着色',
      type: 'switch',
      value: currentMaterial.value.vertexColors
    };
  });
  const vertexColorsTips = `是否使用顶点着色。默认值为false。 此引擎支持RGB或者RGBA两种顶点颜色，取决于缓冲 attribute 使用的是三分量（RGB）还是四分量（RGBA）`;
  const vertexColorsChange = val => {
    modelMaterialChange('vertexColors', val);
  };

  const mapData = computed(() => {
    return {
      label: '颜色贴图',
      type: 'upload',
      value: sceneStore.getCurrentMaterialImage('map')
    };
  });
  const mapTips = `颜色贴图。可以选择包括一个alpha通道，通常与.transparent 或.alphaTest。默认为null。 纹理贴图颜色由漫反射颜色.color调节。`;
  const mapChange = ({ currentFile }) => {
    modelMaterialChange('map', currentFile);
  };
  const mapDelete = () => {
    deleteModelMaterialMap('map');
  };

  const emissiveMapData = computed(() => {
    return {
      label: '自发光贴图',
      type: 'upload',
      value: sceneStore.getCurrentMaterialImage('emissiveMap')
    };
  });
  const emissiveMapTips = `设置放射（发光）贴图。默认值为null。放射贴图颜色由放射颜色和强度所调节。 如果你有一个放射贴图，请务必将放射颜色设置为黑色以外的其他颜色。`;
  const emissiveMapChange = ({ currentFile }) => {
    modelMaterialChange('emissiveMap', currentFile);
  };
  const emissiveMapDelete = () => {
    deleteModelMaterialMap('emissiveMap');
  };

  const alphaMapData = computed(() => {
    return {
      label: '透明贴图',
      type: 'upload',
      value: sceneStore.getCurrentMaterialImage('alphaMap')
    };
  });
  const alphaMapTips = `alpha贴图是一张灰度纹理，用于控制整个表面的不透明度。（黑色：完全透明；白色：完全不透明）。 默认值为null。

  仅使用纹理的颜色，忽略alpha通道（如果存在）。 对于RGB和RGBA纹理，WebGL渲染器在采样此纹理时将使用绿色通道， 因为在DXT压缩和未压缩RGB 565格式中为绿色提供了额外的精度。 Luminance-only以及luminance/alpha纹理也仍然有效。`;
  const alphaMapChange = ({ currentFile }) => {
    modelMaterialChange('alphaMap', currentFile);
  };
  const alphaMapDelete = () => {
    deleteModelMaterialMap('alphaMap');
  };

  const bumpMapData = computed(() => {
    return {
      label: '凹凸贴图',
      type: 'upload',
      value: sceneStore.getCurrentMaterialImage('bumpMap'),
      inputValue: currentMaterial.value.bumpScale === undefined ? 1 : currentMaterial.value.bumpScale,
      showInput: true,
      max: 1,
      min: 0,
      step: 0.01
    };
  });
  const bumpMapTips = `用于创建凹凸贴图的纹理。黑色和白色值映射到与光照相关的感知深度。凹凸实际上不会影响对象的几何形状，只影响光照。如果定义了法线贴图，则将忽略该贴图。`;
  const bumpMapChange = ({ currentFile }) => {
    modelMaterialChange('bumpMap', currentFile);
  };
  const bumpScaleChange = ({ value }) => {
    modelMaterialChange('bumpScale', value);
  };
  const bumpMapDelete = () => {
    deleteModelMaterialMap('bumpMap');
  };

  const normalMapData = computed(() => {
    return {
      label: '法线贴图',
      type: 'upload',
      value: sceneStore.getCurrentMaterialImage('normalMap'),
      inputValue: currentMaterial.value.normalScale?.x === undefined ? 1 : currentMaterial.value.normalScale.x,
      input2Value: currentMaterial.value.normalScale?.y === undefined ? 1 : currentMaterial.value.normalScale.y,
      showInput: true,
      max: 1,
      min: 0,
      step: 0.01
    };
  });
  const normalMapTips = `用于创建法线贴图的纹理。RGB值会影响每个像素片段的曲面法线，并更改颜色照亮的方式。法线贴图不会改变曲面的实际形状，只会改变光照。如果材质具有使用左手约定创建的法线贴图，则应对 normalScale 的 y 分量取反以补偿不同的右手习惯。`;
  const normalMapChange = ({ currentFile }) => {
    modelMaterialChange('normalMap', currentFile);
  };
  const normalScaleChange = ({ value, type }) => {
    modelMaterialChange('normalScale', { [type]: value });
  };
  const normalMapDelete = () => {
    deleteModelMaterialMap('normalMap');
  };

  const clearcoatMapData = computed(() => {
    return {
      label: '清漆贴图',
      type: 'upload',
      value: sceneStore.getCurrentMaterialImage('clearcoatMap')
    };
  });
  const clearcoatMapTips = `这个贴图的红色通道值会与清漆强度相乘作为整个清漆层的强度值层，默认为null。`;
  const clearcoatMapChange = ({ currentFile }) => {
    modelMaterialChange('clearcoatMap', currentFile);
  };
  const clearcoatMapDelete = () => {
    deleteModelMaterialMap('clearcoatMap');
  };

  const clearcoatNormalMapData = computed(() => {
    return {
      label: '清漆法线贴图',
      type: 'upload',
      value: sceneStore.getCurrentMaterialImage('clearcoatNormalMap'),
      inputValue:
        currentMaterial.value.clearcoatNormalScale?.x === undefined ? 1 : currentMaterial.value.clearcoatNormalScale.x,
      input2Value:
        currentMaterial.value.clearcoatNormalScale?.y === undefined ? 1 : currentMaterial.value.clearcoatNormalScale.y,
      showInput: true,
      max: 1,
      min: 0,
      step: 0.01
    };
  });
  const clearcoatNormalMapTips = `用于为清漆层设置的独立的法线贴图，默认为null。`;
  const clearcoatNormalMapChange = ({ currentFile }) => {
    modelMaterialChange('clearcoatNormalMap', currentFile);
  };
  const clearcoatNormalScaleChange = ({ value, type }) => {
    modelMaterialChange('clearcoatNormalScale', { [type]: value });
  };
  const clearcoatNormalMapDelete = () => {
    deleteModelMaterialMap('clearcoatNormalMap');
  };

  const clearcoatRoughnessMapData = computed(() => {
    return {
      label: '清漆粗糙贴图',
      type: 'upload',
      value: sceneStore.getCurrentMaterialImage('clearcoatRoughnessMap')
    };
  });
  const clearcoatRoughnessMapTips = `此纹理的绿色通道值会与.clearcoatRoughness相乘，用于改变clear coat的粗糙度，默认为null`;
  const clearcoatRoughnessMapChange = ({ currentFile }) => {
    modelMaterialChange('clearcoatRoughnessMap', currentFile);
  };
  const clearcoatRoughnessMapDelete = () => {
    deleteModelMaterialMap('clearcoatRoughnessMap');
  };

  const displacementMapData = computed(() => {
    return {
      label: '置换贴图',
      type: 'upload',
      value: sceneStore.getCurrentMaterialImage('displacementMap'),
      inputValue: currentMaterial.value.displacementScale === undefined ? 1 : currentMaterial.value.displacementScale,
      showInput: true,
      max: 10,
      min: 0,
      step: 0.01
    };
  });
  const displacementMapTips = `位移贴图会影响网格顶点的位置，与仅影响材质的光照和阴影的其他贴图不同，移位的顶点可以投射阴影，阻挡其他对象， 以及充当真实的几何体。位移纹理是指：网格的所有顶点被映射为图像中每个像素的值（白色是最高的），并且被重定位。`;
  const displacementMapChange = ({ currentFile }) => {
    modelMaterialChange('displacementMap', currentFile);
  };
  const displacementScaleChange = ({ value }) => {
    modelMaterialChange('displacementScale', value);
  };
  const displacementMapDelete = () => {
    deleteModelMaterialMap('displacementMap');
  };

  const roughnessMapData = computed(() => {
    return {
      label: '粗糙贴图',
      type: 'upload',
      value: sceneStore.getCurrentMaterialImage('roughnessMap')
    };
  });
  const roughnessMapTips = `该纹理的绿色通道用于改变材质的粗糙度`;
  const roughnessMapChange = ({ currentFile }) => {
    modelMaterialChange('roughnessMap', currentFile);
  };
  const roughnessMapDelete = () => {
    deleteModelMaterialMap('roughnessMap');
  };

  const metalnessMapData = computed(() => {
    return {
      label: '金属贴图',
      type: 'upload',
      value: sceneStore.getCurrentMaterialImage('metalnessMap')
    };
  });
  const metalnessMapTips = `该纹理的绿色通道用于改变材质的粗糙度`;
  const metalnessMapChange = ({ currentFile }) => {
    modelMaterialChange('metalnessMap', currentFile);
  };
  const metalnessMapDelete = () => {
    deleteModelMaterialMap('metalnessMap');
  };

  const iridescenceMapData = computed(() => {
    return {
      label: '彩虹色贴图',
      type: 'upload',
      value: sceneStore.getCurrentMaterialImage('iridescenceMap')
    };
  });
  const iridescenceMapChange = ({ currentFile }) => {
    modelMaterialChange('iridescenceMap', currentFile);
  };
  const iridescenceMapDelete = () => {
    deleteModelMaterialMap('iridescenceMap');
  };

  const sheenColorMapData = computed(() => {
    return {
      label: '光泽颜色贴图',
      type: 'upload',
      value: sceneStore.getCurrentMaterialImage('sheenColorMap')
    };
  });
  const sheenColorMapTips = `此纹理的RGB通道会与.sheenColor光泽颜色相乘，最终作为光泽颜色结果，默认为null。`;
  const sheenColorMapChange = ({ currentFile }) => {
    modelMaterialChange('sheenColorMap', currentFile);
  };
  const sheenColorMapDelete = () => {
    deleteModelMaterialMap('sheenColorMap');
  };

  const sheenRoughnessMapData = computed(() => {
    return {
      label: '光泽粗糙贴图',
      type: 'upload',
      value: sceneStore.getCurrentMaterialImage('sheenRoughnessMap')
    };
  });
  const sheenRoughnessMapTips = `此纹理的RGB通道会与.sheenColor光泽颜色相乘，最终作为光泽颜色结果，默认为null。`;
  const sheenRoughnessMapChange = ({ currentFile }) => {
    modelMaterialChange('sheenRoughnessMap', currentFile);
  };
  const sheenRoughnessMapDelete = () => {
    deleteModelMaterialMap('sheenRoughnessMap');
  };

  const iridescenceThicknessMapData = computed(() => {
    return {
      label: '彩虹厚度贴图',
      type: 'upload',
      value: sceneStore.getCurrentMaterialImage('iridescenceThicknessMap'),
      inputValue:
        currentMaterial.value.iridescenceThicknessRange?.[0] === undefined
          ? 1
          : currentMaterial.value.iridescenceThicknessRange[0],
      input2Value:
        currentMaterial.value.iridescenceThicknessRange?.[1] === undefined
          ? 1
          : currentMaterial.value.iridescenceThicknessRange[1],
      showInput: true,
      max: 100,
      min: 0,
      step: 0.01
    };
  });
  const iridescenceThicknessMapTips = `此纹理的透明通道会与.sheenRoughness相乘，用于改变光泽层的粗糙度，默认为null;`;
  const iridescenceThicknessMapChange = ({ currentFile }) => {
    modelMaterialChange('iridescenceThicknessMap', currentFile);
  };
  const iridescenceThicknessRangeChange = ({ value, type }) => {
    modelMaterialChange('iridescenceThicknessRange', { [type == 'x' ? 0 : 1]: value });
  };
  const iridescenceThicknessMapDelete = () => {
    deleteModelMaterialMap('iridescenceThicknessMap');
  };

  const envMapData = computed(() => {
    return {
      label: '环境贴图',
      type: 'upload',
      inputValue: currentMaterial.value.envMapIntensity,
      value: sceneStore.getCurrentMaterialImage('envMap'),
      showInput: true,
      texture: true,
      max: 3,
      min: 0,
      step: 0.01
    };
  });
  const envMapTips = `环境贴图，为了能够保证物理渲染准确，您应该添加由PMREMGenerator预处理过的环境贴图，默认为null。`;
  const envMapChange = ({ currentFile }) => {
    modelMaterialChange('envMap', currentFile);
  };
  const envMapIntensityChange = ({ value }) => {
    modelMaterialChange('envMapIntensity', value);
  };
  const envMapDelete = () => {
    deleteModelMaterialMap('envMap');
  };

  const lightMapData = computed(() => {
    return {
      label: '光照贴图',
      type: 'upload',
      value: sceneStore.getCurrentMaterialImage('lightMap')
    };
  });
  const lightMapTips = `环境贴图，为了能够保证物理渲染准确，您应该添加由PMREMGenerator预处理过的环境贴图，默认为null。`;
  const lightMapChange = ({ currentFile }) => {
    modelMaterialChange('lightMap', currentFile);
  };
  const lightMapDelete = () => {
    deleteModelMaterialMap('lightMap');
  };

  const aoMapData = computed(() => {
    return {
      label: 'AO贴图',
      type: 'upload',
      value: sceneStore.getCurrentMaterialImage('aoMap'),
      inputValue: currentMaterial.value.aoMapIntensity === undefined ? 1 : currentMaterial.value.aoMapIntensity,
      showInput: true,
      max: 1,
      min: 0,
      step: 0.01
    };
  });
  const aoMapTips = `该纹理的红色通道用作环境遮挡贴图。默认值为null。aoMap需要第二组UV。`;
  const aoMapChange = ({ currentFile }) => {
    modelMaterialChange('aoMap', currentFile);
  };
  const aoMapIntensityChange = ({ value }) => {
    modelMaterialChange('aoMapIntensity', value);
  };
  const aoMapDelete = () => {
    deleteModelMaterialMap('aoMap');
  };

  const transmissionMapData = computed(() => {
    return {
      label: '透光贴图',
      type: 'upload',
      value: sceneStore.getCurrentMaterialImage('transmissionMap')
    };
  });
  const transmissionMapTips = `此纹理的红色通道会与透光性.transmission相乘最为最终的透光性结果。默认为null。`;
  const transmissionMapChange = ({ currentFile }) => {
    modelMaterialChange('transmissionMap', currentFile);
  };
  const transmissionMapDelete = () => {
    deleteModelMaterialMap('transmissionMap');
  };

  const thicknessMapData = computed(() => {
    return {
      label: '厚度贴图',
      type: 'upload',
      value: sceneStore.getCurrentMaterialImage('thicknessMap')
    };
  });
  const thicknessMapTips = `定义厚度的纹理，存储在 G 通道中。 这将乘以.厚度。 默认为空。`;
  const thicknessMapChange = ({ currentFile }) => {
    modelMaterialChange('thicknessMap', currentFile);
  };
  const thicknessMapDelete = () => {
    deleteModelMaterialMap('thicknessMap');
  };

  const specularMapData = computed(() => {
    return {
      label: '高光贴图',
      type: 'upload',
      value: sceneStore.getCurrentMaterialImage('specularMap')
    };
  });
  const specularMapTips = `材质使用的高光贴图。默认值为null`;
  const specularMapChange = ({ currentFile }) => {
    modelMaterialChange('specularMap', currentFile);
  };
  const specularMapDelete = () => {
    deleteModelMaterialMap('specularMap');
  };

  const specularColorMapData = computed(() => {
    return {
      label: '反射贴图',
      type: 'upload',
      value: sceneStore.getCurrentMaterialImage('specularColorMap')
    };
  });
  const specularColorMapTips = `此纹理的alpha通道将与.specularColor相乘，用于逐像素地控制高光颜色。默认值为null。`;
  const specularColorMapChange = ({ currentFile }) => {
    modelMaterialChange('specularColorMap', currentFile);
  };
  const specularColorMapDelete = () => {
    deleteModelMaterialMap('specularColorMap');
  };

  const specularColorData = computed(() => {
    return {
      label: '高光反射色',
      type: 'color',
      value: currentMaterial.value.specularColor,
      key: colorKey.value
    };
  });
  const specularColorTips = `非金属材质在垂直于法线方向观看时的高光反射颜色。默认值为0xffffff，白色。`;
  const specularColorChange = val => {
    const color = val;
    modelMaterialChange('specularColor', color);
  };

  const opacityData = computed(() => {
    return {
      label: '透明度',
      type: 'slider',
      value: currentMaterial.value.opacity,
      showInput: true,
      max: 1,
      min: 0,
      step: 0.01
    };
  });
  const opacityTips = `在0.0 - 1.0的范围内的浮点数，表明材质的透明度。值0.0表示完全透明，1.0表示完全不透明。
  如果材质的transparent属性未设置为true，则材质将保持完全不透明，此值仅影响其颜色。 默认值为1.0。`;
  const opacityChange = val => {
    modelMaterialChange('opacity', val);
  };

  const nameData = computed(() => {
    return {
      label: '材质名',
      type: 'textInput',
      value: currentMaterial.value.name
    };
  });
  const nameTips = `材质名称`;
  const nameChange = value => {
    modelMaterialChange('name', value);
  };

  const flatShadingData = computed(() => {
    return {
      label: '平面着色',
      type: 'switch',
      value: currentMaterial.value.flatShading
    };
  });
  const flatShadingTips = `定义材质是否使用平面着色进行渲染。默认值为false。`;
  const flatShadingChange = val => {
    modelMaterialChange('flatShading', val);
  };

  const forceSinglePassData = computed(() => {
    return {
      label: '单通道渲染',
      type: 'switch',
      value: currentMaterial.value.forceSinglePass
    };
  });
  const forceSinglePassTips = `决定双面透明的东西是否强制使用单通道渲染，默认为false。
  为了减少一些半透明物体的渲染错误，此引擎调用两次绘制来渲染渲染双面透明的东西。 但是此方案可能会导致在某些情况下使绘制调用次数翻倍，例如渲染一些平面的植物例如草精灵之类的。 在这些情况下，将forceSinglePass设置为true来使用单通道渲染来避免性能问题。`;
  const forceSinglePassChange = val => {
    modelMaterialChange('forceSinglePass', val);
  };

  const depthTestData = computed(() => {
    return {
      label: '深度测试',
      type: 'switch',
      value: currentMaterial.value.depthTest
    };
  });
  const depthTestTips = `是否在渲染此材质时启用深度测试。默认为 true。`;
  const depthTestChange = val => {
    modelMaterialChange('depthTest', val);
  };

  const depthWriteData = computed(() => {
    return {
      label: '深度缓冲',
      type: 'switch',
      value: currentMaterial.value.depthWrite
    };
  });
  const depthWriteTips = `渲染此材质是否对深度缓冲区有任何影响。默认为true。

  在绘制2D叠加时，将多个事物分层在一起而不创建z-index时，禁用深度写入会很有用。`;
  const depthWriteChange = val => {
    modelMaterialChange('depthWrite', val);
  };

  const transparentData = computed(() => {
    return {
      label: '透明性',
      type: 'switch',
      value: currentMaterial.value.transparent
    };
  });
  const transparentTips = `定义此材质是否透明。这对渲染有影响，因为透明对象需要特殊处理，并在非透明对象之后渲染。
  设置为true时，通过设置材质的opacity属性来控制材质透明的程度。
  默认值为false。`;
  const transparentChange = val => {
    modelMaterialChange('transparent', val);
  };

  const wireframeData = computed(() => {
    return {
      label: '线框',
      type: 'switch',
      value: currentMaterial.value.wireframe
    };
  });
  const wireframeTips = `将几何体渲染为线框。默认值为false（即渲染为平面多边形）。`;
  const wireframeChange = val => {
    modelMaterialChange('wireframe', val);
  };

  const ditheringData = computed(() => {
    return {
      label: '消除条带',
      type: 'switch',
      value: currentMaterial.value.dithering
    };
  });
  const ditheringTips = `是否对颜色应用抖动以消除条带的外观。默认值为 false。`;
  const ditheringChange = val => {
    modelMaterialChange('dithering', val);
  };

  const premultipliedAlphaData = computed(() => {
    return {
      label: '预乘透明值',
      type: 'switch',
      value: currentMaterial.value.premultipliedAlpha
    };
  });
  const premultipliedAlphaTips = `是否预乘alpha（透明度）值。有关差异的示例，请参阅WebGL / Materials / Physical / Transmission。 默认值为false。`;
  const premultipliedAlphaChange = val => {
    modelMaterialChange('premultipliedAlpha', val);
  };

  const toneMappedData = computed(() => {
    return {
      label: '场景曝光影响',
      type: 'switch',
      value: currentMaterial.value.toneMapped
    };
  });
  const toneMappedTips = `定义这个材质是否会被渲染器的toneMapping设置所影响，默认为 true 。`;
  const toneMappedChange = val => {
    modelMaterialChange('toneMapped', val);
  };

  const alphaTestData = computed(() => {
    return {
      label: '透明测试',
      type: 'slider',
      value: currentMaterial.value.alphaTest,
      showInput: true,
      max: 1,
      min: 0,
      step: 0.01
    };
  });
  const alphaTestTips = `设置运行alphaTest时要使用的alpha值。如果不透明度低于此值，则不会渲染材质。默认值为0。`;
  const alphaTestChange = val => {
    modelMaterialChange('alphaTest', val);
  };
  const deleteModelMaterialMap = key => {
    sceneStore.deleteModelMaterialMap({
      [key]: null
    });
  };
  const modelMaterialChange = async (key, val) => {
    if (key.endsWith('Map') || key == 'map') {
      switch (val.status) {
        case 'done':
        case 'error':
          await sceneStore.setCurrentModelMaterial(key, val);
          if (sceneStore.threeEngine.material__three.rotationRepeatMap.includes(key)) {
            setTimeout(() => {
              sceneStore.setCurrentModelMaterial('repeat', currentMaterial.value.repeat);
              sceneStore.setCurrentModelMaterial('rotation', currentMaterial.value.rotation || 0);
            }, 300);
          }
          if (sceneStore.threeEngine.material__three.rotationRepeatSingleMap.includes(key)) {
            setTimeout(() => {
              sceneStore.setCurrentModelMaterial(`${key}Repeat`, currentMaterial.value[`${key}Repeat`] ?? 1);
              sceneStore.setCurrentModelMaterial(`${key}Rotation`, currentMaterial.value[`${key}Rotation`] ?? 0);
            }, 300);
          }
          break;
        default:
          break;
      }
    } else {
      sceneStore.setCurrentModelMaterial(key, val);
    }
  };

  const repeatData = computed(() => {
    return {
      label: '贴图缩放',
      type: 'slider',
      value: currentMaterial.value.repeat ?? 1,
      showInput: true,
      max: 50,
      min: 0,
      step: 0.1
    };
  });
  const repeatChange = val => {
    modelMaterialChange('repeat', val);
  };
  const rotationData = computed(() => {
    return {
      label: '贴图旋转',
      type: 'slider',
      value: currentMaterial.value.rotation ?? 0,
      showInput: true,
      max: 360,
      min: 0,
      step: 0.1
    };
  });
  const rotationChange = val => {
    modelMaterialChange('rotation', val);
  };
  const mapRotationData = computed(() => {
    return {
      label: '颜色贴图旋转',
      type: 'slider',
      value: currentMaterial.value.mapRotation ?? 0,
      showInput: true,
      max: 360,
      min: 0,
      step: 0.1
    };
  });
  const mapRotationChange = val => {
    modelMaterialChange('mapRotation', val);
  };

  const mapRepeatData = computed(() => {
    return {
      label: '颜色贴图缩放',
      type: 'slider',
      value: currentMaterial.value.mapRepeat ?? 1,
      showInput: true,
      max: 50,
      min: 0,
      step: 0.1
    };
  });
  const mapRepeatChange = val => {
    modelMaterialChange('mapRepeat', val);
  };

  const aoMapRepeatData = computed(() => {
    return {
      label: 'ao贴图缩放',
      type: 'slider',
      value: currentMaterial.value.aoMapRepeat ?? 1,
      showInput: true,
      max: 50,
      min: 0,
      step: 0.1
    };
  });
  const aoMapRepeatChange = val => {
    modelMaterialChange('aoMapRepeat', val);
  };
  const aoMapRotationData = computed(() => {
    return {
      label: 'ao贴图旋转',
      type: 'slider',
      value: currentMaterial.value.aoMapRotation ?? 0,
      showInput: true,
      max: 360,
      min: 0,
      step: 0.1
    };
  });
  const aoMapRotationChange = val => {
    modelMaterialChange('aoMapRotation', val);
  };
  const DEFAULT__MATERIAL = computed(() => {
    return [
      {
        data: materialTypeData.value,
        change: materialTypeChange,
        tips: '',
        inputChange: () => {},
        delete: () => {},
        key: 'materialType'
      },
      {
        data: nameData.value,
        change: nameChange,
        tips: nameTips,
        inputChange: () => {},
        delete: () => {},
        key: 'name'
      },
      {
        data: sideData.value,
        change: sideChange,
        tips: '定义将要渲染哪一面 - 正面，背面或两者。 默认为THREE.FrontSide。其他选项有THREE.BackSide 和 THREE.DoubleSide。',
        inputChange: () => {},
        delete: () => {},
        key: 'side'
      },
      {
        data: blendingData.value,
        change: blendingChange,
        tips: `在使用此材质显示对象时要使用何种混合。
        必须将其设置为CustomBlending才能使用自定义blendSrc, blendDst 或者 [page:Constant blendEquation]。 混合模式所有可能的取值请参阅constants。默认值为NormalBlending。`,
        inputChange: () => {},
        delete: () => {},
        key: 'blending'
      },
      {
        data: colorData.value,
        change: colorChange,
        tips: '',
        inputChange: () => {},
        delete: () => {},
        key: 'color'
      },
      {
        data: mapData.value,
        change: mapChange,
        tips: mapTips,
        inputChange: () => {},
        delete: mapDelete,
        key: 'map'
      },
      {
        data: mapRepeatData.value,
        change: mapRepeatChange,
        tips: '',
        inputChange: () => {},
        delete: () => {},
        key: 'mapRepeat'
      },
      {
        data: mapRotationData.value,
        change: mapRotationChange,
        tips: '',
        inputChange: () => {},
        delete: () => {},
        key: 'mapRotation'
      },
      {
        data: aoMapData.value,
        change: aoMapChange,
        tips: aoMapTips,
        inputChange: aoMapIntensityChange,
        delete: aoMapDelete,
        key: 'aoMap'
      },
      {
        data: aoMapRepeatData.value,
        change: aoMapRepeatChange,
        tips: '',
        inputChange: () => {},
        delete: () => {},
        key: 'aoMapRepeat'
      },
      {
        data: aoMapRotationData.value,
        change: aoMapRotationChange,
        tips: '',
        inputChange: () => {},
        delete: () => {},
        key: 'aoMapRotation'
      },
      {
        data: normalMapData.value,
        change: normalMapChange,
        tips: normalMapTips,
        inputChange: normalScaleChange,
        delete: normalMapDelete,
        key: 'normalMap'
      },
      {
        data: roughnessMapData.value,
        change: roughnessMapChange,
        tips: roughnessMapTips,
        inputChange: () => {},
        delete: roughnessMapDelete,
        key: 'roughnessMap'
      },
      {
        data: roughnessData.value,
        change: roughnessChange,
        tips: roughnessTips,
        inputChange: () => {},
        delete: () => {},
        key: 'roughness'
      },
      {
        data: metalnessMapData.value,
        change: metalnessMapChange,
        tips: metalnessMapTips,
        inputChange: () => {},
        delete: metalnessMapDelete,
        key: 'metalnessMap'
      },
      {
        data: metalnessData.value,
        change: metalnessChange,
        tips: metalnessTips,
        inputChange: () => {},
        delete: () => {},
        key: 'metalness'
      },
      {
        data: repeatData.value,
        change: repeatChange,
        tips: '',
        inputChange: () => {},
        delete: () => {},
        key: 'repeat'
      },
      {
        data: rotationData.value,
        change: rotationChange,
        tips: '',
        inputChange: () => {},
        delete: () => {},
        key: 'rotation'
      },
      {
        data: vertexColorsData.value,
        change: vertexColorsChange,
        tips: vertexColorsTips,
        inputChange: () => {},
        delete: () => {},
        key: 'vertexColors'
      },
      {
        data: flatShadingData.value,
        change: flatShadingChange,
        tips: flatShadingTips,
        inputChange: () => {},
        delete: () => {},
        key: 'flatShading'
      },
      {
        data: opacityData.value,
        change: opacityChange,
        tips: opacityTips,
        inputChange: () => {},
        delete: () => {},
        key: 'opacity'
      },
      {
        data: transparentData.value,
        change: transparentChange,
        tips: transparentTips,
        inputChange: () => {},
        delete: () => {},
        key: 'transparent'
      },
      {
        data: forceSinglePassData.value,
        change: forceSinglePassChange,
        tips: forceSinglePassTips,
        inputChange: () => {},
        delete: () => {},
        key: 'forceSinglePass'
      },
      {
        data: alphaTestData.value,
        change: alphaTestChange,
        tips: alphaTestTips,
        inputChange: () => {},
        delete: () => {},
        key: 'alphaTest'
      },
      {
        data: depthTestData.value,
        change: depthTestChange,
        tips: depthTestTips,
        inputChange: () => {},
        delete: () => {},
        key: 'depthTest'
      },
      {
        data: depthWriteData.value,
        change: depthWriteChange,
        tips: depthWriteTips,
        inputChange: () => {},
        delete: () => {},
        key: 'depthWrite'
      },
      {
        data: wireframeData.value,
        change: wireframeChange,
        tips: wireframeTips,
        inputChange: () => {},
        delete: () => {},
        key: 'wireframe'
      }
    ];
  });
  const MeshStandardMaterial = computed(() => {
    return [...DEFAULT__MATERIAL.value, ...DEFAULT__MAPMATERIAL.value];
  });
  const DEFAULT__MAPMATERIAL = computed(() => {
    return [
      {
        data: emissiveMapData.value,
        change: emissiveMapChange,
        tips: emissiveMapTips,
        inputChange: () => {},
        delete: emissiveMapDelete,
        key: 'emissiveMap'
      },
      {
        data: alphaMapData.value,
        change: alphaMapChange,
        tips: alphaMapTips,
        inputChange: () => {},
        delete: alphaMapDelete,
        key: 'alphaMap'
      },
      {
        data: bumpMapData.value,
        change: bumpMapChange,
        tips: bumpMapTips,
        inputChange: bumpScaleChange,
        delete: bumpMapDelete,
        key: 'bumpMap'
      },
      {
        data: displacementMapData.value,
        change: displacementMapChange,
        tips: displacementMapTips,
        inputChange: displacementScaleChange,
        delete: displacementMapDelete,
        key: 'displacementMap'
      },
      {
        data: envMapData.value,
        change: envMapChange,
        tips: envMapTips,
        inputChange: envMapIntensityChange,
        delete: envMapDelete,
        accept: '.hdr',
        key: 'envMap'
      },
      {
        data: lightMapData.value,
        change: lightMapChange,
        tips: lightMapTips,
        inputChange: () => {},
        delete: lightMapDelete,
        key: 'lightMap'
      }
    ];
  });
  const MeshPhysicalMaterial = computed(() => {
    return [
      ...DEFAULT__MATERIAL.value,
      {
        data: specularColorMapData.value,
        change: specularColorMapChange,
        tips: specularColorMapTips,
        inputChange: () => {},
        delete: specularColorMapDelete,
        key: 'specularColorMap'
      },
      {
        data: specularColorData.value,
        change: specularColorChange,
        tips: specularColorTips,
        inputChange: () => {},
        delete: () => {},
        key: 'specularColor'
      },
      {
        data: reflectivityData.value,
        change: reflectivityChange,
        tips: reflectivityTips,
        inputChange: () => {},
        delete: () => {},
        key: 'reflectivity'
      },
      {
        data: iorData.value,
        change: iorChange,
        tips: iorTips,
        inputChange: () => {},
        delete: () => {},
        key: 'ior'
      },
      {
        data: clearcoatData.value,
        change: clearcoatChange,
        tips: clearcoatTips,
        inputChange: () => {},
        delete: () => {},
        key: 'clearcoat'
      },
      {
        data: clearcoatRoughnessData.value,
        change: clearcoatRoughnessChange,
        tips: clearcoatRoughnessTips,
        inputChange: () => {},
        delete: () => {},
        key: 'clearcoatRoughness'
      },
      {
        data: iridescenceData.value,
        change: iridescenceChange,
        tips: '',
        inputChange: () => {},
        delete: () => {},
        key: 'iridescence'
      },
      {
        data: iridescenceIORData.value,
        change: iridescenceIORChange,
        tips: '',
        inputChange: () => {},
        delete: () => {},
        key: 'iridescenceIOR'
      },
      {
        data: sheenData.value,
        change: sheenChange,
        tips: sheenTips,
        inputChange: () => {},
        delete: () => {},
        key: 'sheen'
      },
      {
        data: sheenRoughnessData.value,
        change: sheenRoughnessChange,
        tips: sheenRoughnessTips,
        inputChange: () => {},
        delete: () => {},
        key: 'sheenRoughness'
      },
      {
        data: sheenColorData.value,
        change: sheenColorChange,
        tips: sheenColorTips,
        inputChange: () => {},
        delete: () => {},
        key: 'sheenColor'
      },
      {
        data: transmissionData.value,
        change: transmissionChange,
        tips: transmissionTips,
        inputChange: () => {},
        delete: () => {},
        key: 'transmission'
      },
      {
        data: emissiveData.value,
        change: emissiveChange,
        tips: emissiveTips,
        inputChange: () => {},
        delete: () => {},
        key: 'emissive'
      },
      {
        data: emissiveIntensityData.value,
        change: emissiveIntensityChange,
        tips: emissiveIntensityTips,
        inputChange: () => {},
        delete: () => {},
        key: 'emissiveIntensity'
      },
      {
        data: attenuationDistanceData.value,
        change: attenuationDistanceChange,
        tips: attenuationDistanceTips,
        inputChange: () => {},
        delete: () => {},
        key: 'attenuationDistance'
      },
      {
        data: attenuationColorData.value,
        change: attenuationColorChange,
        tips: attenuationColorTips,
        inputChange: () => {},
        delete: () => {},
        key: 'attenuationColor'
      },
      {
        data: thicknessData.value,
        change: thicknessChange,
        tips: thicknessTips,
        inputChange: () => {},
        delete: () => {},
        key: 'thickness'
      },
      {
        data: ditheringData.value,
        change: ditheringChange,
        tips: ditheringTips,
        inputChange: () => {},
        delete: () => {},
        key: 'dithering'
      },
      {
        data: premultipliedAlphaData.value,
        change: premultipliedAlphaChange,
        tips: premultipliedAlphaTips,
        inputChange: () => {},
        delete: () => {},
        key: 'premultipliedAlpha'
      },
      {
        data: toneMappedData.value,
        change: toneMappedChange,
        tips: toneMappedTips,
        inputChange: () => {},
        delete: () => {},
        key: 'toneMapped'
      },
      ...DEFAULT__MAPMATERIAL.value,
      {
        data: iridescenceMapData.value,
        change: iridescenceMapChange,
        tips: '',
        inputChange: () => {},
        delete: iridescenceMapDelete,
        key: 'iridescenceMap'
      },
      {
        data: clearcoatMapData.value,
        change: clearcoatMapChange,
        tips: clearcoatMapTips,
        inputChange: () => {},
        delete: clearcoatMapDelete,
        key: 'clearcoatMap'
      },
      {
        data: clearcoatRoughnessMapData.value,
        change: clearcoatRoughnessMapChange,
        tips: clearcoatRoughnessMapTips,
        inputChange: () => {},
        delete: clearcoatRoughnessMapDelete,
        key: 'clearcoatRoughnessMap'
      },
      {
        data: sheenColorMapData.value,
        change: sheenColorMapChange,
        tips: sheenColorMapTips,
        inputChange: () => {},
        delete: sheenColorMapDelete,
        key: 'sheenColorMap'
      },
      {
        data: sheenRoughnessMapData.value,
        change: sheenRoughnessMapChange,
        tips: sheenRoughnessMapTips,
        inputChange: () => {},
        delete: sheenRoughnessMapDelete,
        key: 'sheenRoughnessMap'
      },
      {
        data: transmissionMapData.value,
        change: transmissionMapChange,
        tips: transmissionMapTips,
        inputChange: () => {},
        delete: transmissionMapDelete,
        key: 'transmissionMap'
      },
      {
        data: thicknessMapData.value,
        change: thicknessMapChange,
        tips: thicknessMapTips,
        inputChange: () => {},
        delete: thicknessMapDelete,
        key: 'thicknessMap'
      },
      {
        data: clearcoatNormalMapData.value,
        change: clearcoatNormalMapChange,
        tips: clearcoatNormalMapTips,
        inputChange: clearcoatNormalScaleChange,
        delete: clearcoatNormalMapDelete,
        key: 'clearcoatNormalMap'
      },
      {
        data: iridescenceThicknessMapData.value,
        change: iridescenceThicknessMapChange,
        tips: iridescenceThicknessMapTips,
        inputChange: iridescenceThicknessRangeChange,
        delete: iridescenceThicknessMapDelete,
        key: 'iridescenceThicknessMap'
      }
    ];
  });
  const MeshBasicMaterial = computed(() => {
    return [
      {
        data: materialTypeData.value,
        change: materialTypeChange,
        tips: '',
        inputChange: () => {},
        delete: () => {},
        key: 'materialType'
      },
      {
        data: nameData.value,
        change: nameChange,
        tips: nameTips,
        inputChange: () => {},
        delete: () => {},
        key: 'name'
      },
      {
        data: sideData.value,
        change: sideChange,
        tips: '定义将要渲染哪一面 - 正面，背面或两者。 默认为THREE.FrontSide。其他选项有THREE.BackSide 和 THREE.DoubleSide。',
        inputChange: () => {},
        delete: () => {},
        key: 'side'
      },
      {
        data: blendingData.value,
        change: blendingChange,
        tips: `在使用此材质显示对象时要使用何种混合。
        必须将其设置为CustomBlending才能使用自定义blendSrc, blendDst 或者 [page:Constant blendEquation]。 混合模式所有可能的取值请参阅constants。默认值为NormalBlending。`,
        inputChange: () => {},
        delete: () => {},
        key: 'blending'
      },
      {
        data: colorData.value,
        change: colorChange,
        tips: '',
        inputChange: () => {},
        delete: () => {},
        key: 'color'
      },
      {
        data: mapData.value,
        change: mapChange,
        tips: mapTips,
        inputChange: () => {},
        delete: mapDelete,
        key: 'map'
      },
      {
        data: aoMapData.value,
        change: aoMapChange,
        tips: aoMapTips,
        inputChange: aoMapIntensityChange,
        delete: aoMapDelete,
        key: 'aoMap'
      },
      {
        data: specularMapData.value,
        change: specularMapChange,
        tips: specularMapTips,
        inputChange: () => {},
        delete: specularMapDelete,
        key: 'specularMap'
      },
      {
        data: repeatData.value,
        change: repeatChange,
        tips: '',
        inputChange: () => {},
        delete: () => {},
        key: 'repeat'
      },
      {
        data: rotationData.value,
        change: rotationChange,
        tips: '',
        inputChange: () => {},
        delete: () => {},
        key: 'rotation'
      },
      {
        data: reflectivityData.value,
        change: reflectivityChange,
        tips: reflectivityTips,
        inputChange: () => {},
        delete: () => {},
        key: 'reflectivity'
      },
      {
        data: alphaMapData.value,
        change: alphaMapChange,
        tips: alphaMapTips,
        inputChange: () => {},
        delete: alphaMapDelete,
        key: 'alphaMap'
      },
      {
        data: lightMapData.value,
        change: lightMapChange,
        tips: lightMapTips,
        inputChange: () => {},
        delete: lightMapDelete,
        key: 'lightMap'
      },
      {
        data: vertexColorsData.value,
        change: vertexColorsChange,
        tips: vertexColorsTips,
        inputChange: () => {},
        delete: () => {},
        key: 'vertexColors'
      },
      {
        data: flatShadingData.value,
        change: flatShadingChange,
        tips: flatShadingTips,
        inputChange: () => {},
        delete: () => {},
        key: 'flatShading'
      },
      {
        data: opacityData.value,
        change: opacityChange,
        tips: opacityTips,
        inputChange: () => {},
        delete: () => {},
        key: 'opacity'
      },
      {
        data: transparentData.value,
        change: transparentChange,
        tips: transparentTips,
        inputChange: () => {},
        delete: () => {},
        key: 'transparent'
      },
      {
        data: forceSinglePassData.value,
        change: forceSinglePassChange,
        tips: forceSinglePassTips,
        inputChange: () => {},
        delete: () => {},
        key: 'forceSinglePass'
      },
      {
        data: alphaTestData.value,
        change: alphaTestChange,
        tips: alphaTestTips,
        inputChange: () => {},
        delete: () => {},
        key: 'alphaTest'
      },
      {
        data: depthTestData.value,
        change: depthTestChange,
        tips: depthTestTips,
        inputChange: () => {},
        delete: () => {},
        key: 'depthTest'
      },
      {
        data: depthWriteData.value,
        change: depthWriteChange,
        tips: depthWriteTips,
        inputChange: () => {},
        delete: () => {},
        key: 'depthWrite'
      },
      {
        data: wireframeData.value,
        change: wireframeChange,
        tips: wireframeTips,
        inputChange: () => {},
        delete: () => {},
        key: 'wireframe'
      }
    ];
  });
  return {
    MeshPhysicalMaterial,
    MeshStandardMaterial,
    MeshBasicMaterial,
    fileImageData,
    modelMaterialChange
  };
}
