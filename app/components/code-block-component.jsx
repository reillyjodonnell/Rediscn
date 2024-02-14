import { NodeViewContent, NodeViewWrapper } from '@tiptap/react';

export default function CodeBlockComponent({
  node,
  updateAttributes,
  extension,
}) {
  return (
    <NodeViewWrapper className="code-block">
      <pre>
        <NodeViewContent as="code" />
      </pre>
    </NodeViewWrapper>
  );
}
