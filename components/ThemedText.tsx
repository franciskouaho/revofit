import { TextStyles } from '@/constants';
import React from 'react';
import { Text, TextProps } from 'react-native';

interface ThemedTextProps extends TextProps {
  variant?: keyof typeof TextStyles;
  color?: string;
  children: React.ReactNode;
}

export const ThemedText: React.FC<ThemedTextProps> = ({
  variant = 'BodyRegular',
  color = '#FFFFFF',
  style,
  children,
  ...props
}) => {
  const textStyle = TextStyles[variant];
  
  return (
    <Text
      style={[
        textStyle,
        { color },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

// Composants spécialisés pour une utilisation rapide
export const TitleText: React.FC<Omit<ThemedTextProps, 'variant'>> = (props) => (
  <ThemedText variant="H1" {...props} />
);

export const SubtitleText: React.FC<Omit<ThemedTextProps, 'variant'>> = (props) => (
  <ThemedText variant="H2" {...props} />
);

export const SectionText: React.FC<Omit<ThemedTextProps, 'variant'>> = (props) => (
  <ThemedText variant="H3" {...props} />
);

export const BodyText: React.FC<Omit<ThemedTextProps, 'variant'>> = (props) => (
  <ThemedText variant="BodyRegular" {...props} />
);


