import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import * as DropzoneLib from 'dropzone';

const DropzoneComponent = ({
  fileError,
  addFile,
  removeFile,
  dropzoneID
}) => {
  const dropzoneNode = React.createRef();
  // eslint-disable-next-line no-unused-vars
  let dropzone;

  const onAddFile = (file) => {
    addFile(file);
  };

  const onRemoveFile = (file) => {
    removeFile(file);
  };

  const setupDropzone = () => {
    const dropzoneArea = new DropzoneLib(`div#${dropzoneID}`, {
      url: '/not/required/',
      dictDefaultMessage: 'Drop files or click to upload',
      uploadMultiple: true,
      autoProcessQueue: false,
      addRemoveLinks: true,
      createImageThumbnails: true,
    });

    dropzoneArea.on('error', (file, message) => fileError(file, message));

    dropzoneArea.on('addedfile', onAddFile);

    dropzoneArea.on('removedfile', onRemoveFile);

    return dropzoneArea;
  };

  useEffect(() => {
    dropzone = setupDropzone();
    return function destroyDropZone() {
      dropzone.destroy();
    };
  }, []);

  return (
    <div ref={dropzoneNode} id={dropzoneID} className='dropzone'></div>
  );
};

DropzoneComponent.propTypes = {
  fileError: PropTypes.func,
  addFile: PropTypes.func,
  removeFile: PropTypes.func,
  dropzoneID: PropTypes.string
};

export default DropzoneComponent;
