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
import React, { useCallback } from 'react';
import { Hidden } from '@material-ui/core';

import {
  createCombinatorRenderInfos,
  findMatchingUISchema,
  isAllOfControl,
  JsonSchema,
  RankedTester,
  rankWith,
  refResolver,
  StatePropsOfCombinator
} from '@jsonforms/core';
import {
  JsonFormsDispatch,
  RefResolver,
  withJsonFormsCombinatorProps
} from '@jsonforms/react';

const MaterialAllOfRenderer = ({
  schema,
  rootSchema,
  visible,
  renderers,
  path,
  uischemas,
  uischema,
  refParserOptions
}: StatePropsOfCombinator) => {
  const delegateUISchema = findMatchingUISchema(uischemas)(
    schema,
    uischema.scope,
    path
  );
  const resolveRef = useCallback(pointer =>
    refResolver(rootSchema, refParserOptions)(pointer),
    [rootSchema, refParserOptions]
  );

  if (delegateUISchema) {
    return (
      <RefResolver schema={schema} pointer={uischema.scope} resolveRef={resolveRef}>
        {(resolvedSchema: JsonSchema) => (
          <Hidden xsUp={!visible}>
            <JsonFormsDispatch
              schema={resolvedSchema}
              uischema={delegateUISchema}
              path={path}
              renderers={renderers}
            />
          </Hidden>
        )}
      </RefResolver>
    );
  }

  return (
    <RefResolver schema={schema} pointer={uischema.scope} resolveRef={resolveRef}>
      {(resolvedSchema: JsonSchema) => {
        const allOfRenderInfos = createCombinatorRenderInfos(
          resolvedSchema.allOf,
          rootSchema,
          'allOf',
          uischema,
          path,
          uischemas
        );

        return (
          <Hidden xsUp={!visible}>
            {allOfRenderInfos.map((allOfRenderInfo, allOfIndex) => (
              <JsonFormsDispatch
                key={allOfIndex}
                schema={allOfRenderInfo.schema}
                uischema={allOfRenderInfo.uischema}
                path={path}
                renderers={renderers}
              />
            ))}
          </Hidden>
        );
      }}
    </RefResolver>
  );
};

export const materialAllOfControlTester: RankedTester = rankWith(
  3,
  isAllOfControl
);
export default withJsonFormsCombinatorProps(MaterialAllOfRenderer);
