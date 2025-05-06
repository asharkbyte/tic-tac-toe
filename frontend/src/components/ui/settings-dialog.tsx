import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useSettings } from '../../context/SettingsContext';
import { Difficulty } from '../../types';

interface SettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const Settings: React.FC<SettingsProps> = ({ open, onOpenChange }) => {
  const { settings, updateSettings } = useSettings();
  const [tempSettings, setTempSettings] = React.useState(settings);

  React.useEffect(() => {
    setTempSettings(settings);
  }, [settings, open]);

  const handleDifficultyChange = (value: string) => {
    setTempSettings({
      ...tempSettings,
      difficulty: value as Difficulty
    });
  };

  const handleSoundToggle = (checked: boolean) => {
    setTempSettings({
      ...tempSettings,
      soundEnabled: checked
    });
  };

  const handleSave = () => {
    updateSettings(tempSettings);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Game Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="difficulty" className="text-right">
              AI Difficulty
            </Label>
            <Select
              value={tempSettings.difficulty}
              onValueChange={handleDifficultyChange}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="sound" className="text-right">
              Sound Effects
            </Label>
            <div className="col-span-3 flex items-center space-x-2">
              <Switch
                id="sound"
                checked={tempSettings.soundEnabled}
                onCheckedChange={handleSoundToggle}
              />
              <Label htmlFor="sound">{tempSettings.soundEnabled ? 'On' : 'Off'}</Label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
