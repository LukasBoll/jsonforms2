/*
  The MIT License
  
  Copyright (c) 2017-2019 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms
  
  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:
  
  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.
  
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/
import React, { useCallback, useState } from 'react';

import {
  createCombinatorRenderInfos,
  isAnyOfControl,
  JsonSchema,
  RankedTester,
  rankWith,
  refResolver,
  StatePropsOfCombinator
} from '@jsonforms/core';
import {
  JsonFormsDispatch,
  RefResolver,
  withJsonFormsCombinatorProps,
} from '@jsonforms/react';
import { Hidden, Tab, Tabs } from '@material-ui/core';
import CombinatorProperties from './CombinatorProperties';

const MaterialAnyOfRenderer = ({
  schema,
  rootSchema,
  visible,
  path,
  renderers,
  uischema,
  uischemas,
  refParserOptions
}: StatePropsOfCombinator) => {
  const [selectedAnyOf, setSelectedAnyOf] = useState(0);
  const handleChange = useCallback(
    (_ev: any, value: number) => setSelectedAnyOf(value),
    [setSelectedAnyOf]
  );
  const resolveRef = useCallback(pointer =>
    refResolver(rootSchema, refParserOptions)(pointer),
    [rootSchema, refParserOptions]
  );

  return (
    <RefResolver schema={schema} pointer={uischema.scope} resolveRef={resolveRef}>
      {(resolvedSchema: JsonSchema) => {
        const anyOfRenderInfos = createCombinatorRenderInfos(
          resolvedSchema.anyOf,
          rootSchema,
          'anyOf',
          uischema,
          path,
          uischemas
        );

        return (
          <Hidden xsUp={!visible}>
            <CombinatorProperties
              schema={resolvedSchema}
              combinatorKeyword={'anyOf'}
              path={path}
            />
            <Tabs value={selectedAnyOf} onChange={handleChange}>
              {anyOfRenderInfos.map(anyOfRenderInfo => (
                <Tab key={anyOfRenderInfo.label} label={anyOfRenderInfo.label} />
              ))}
            </Tabs>
            {anyOfRenderInfos.map(
              (anyOfRenderInfo, anyOfIndex) =>
                selectedAnyOf === anyOfIndex && (
                  <JsonFormsDispatch
                    key={anyOfIndex}
                    schema={anyOfRenderInfo.schema}
                    uischema={anyOfRenderInfo.uischema}
                    path={path}
                    renderers={renderers}
                  />)
            )}
          </Hidden>
        );
      }}
    </RefResolver>
  );
};

export const materialAnyOfControlTester: RankedTester = rankWith(
  3,
  isAnyOfControl
);
const ConntectedMaterialAnyOfRenderer = withJsonFormsCombinatorProps(MaterialAnyOfRenderer);
ConntectedMaterialAnyOfRenderer.displayName = 'MaterialAnyOfRenderer';
export default ConntectedMaterialAnyOfRenderer;
