import React from 'react';
import { MainVideoComposition } from './MainVideoComposition';
export const ShortVideoComposition: React.FC<{ videoData: any }> = ({ videoData }) => <MainVideoComposition videoData={{ ...(videoData || {}), video_type: 'short_form' }} />;
